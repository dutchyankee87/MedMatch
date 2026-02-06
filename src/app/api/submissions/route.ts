import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import {
  submissions,
  requests,
  users,
  candidates,
  orderConfirmations,
} from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import {
  sendEmail,
  submissionReceivedNotification,
  submissionStatusNotification,
} from '@/lib/email';

// POST /api/submissions - Submit a candidate
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
      with: {
        agency: true,
      },
    });

    if (!user || user.role !== 'agency_user' || !user.agencyId) {
      return NextResponse.json({ error: 'Only agency users can submit candidates' }, { status: 403 });
    }

    const body = await req.json();
    const { requestId, candidateId, proposedRate, cvUrl, notes, additionalInfo } = body;

    // Validate required fields
    if (!requestId || !candidateId || !proposedRate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if request exists and is open
    const request = await db.query.requests.findFirst({
      where: eq(requests.id, requestId),
      with: {
        organization: true,
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (request.status !== 'open') {
      return NextResponse.json({ error: 'Request is not open for submissions' }, { status: 400 });
    }

    // Check if candidate belongs to agency
    const candidate = await db.query.candidates.findFirst({
      where: and(
        eq(candidates.id, candidateId),
        eq(candidates.agencyId, user.agencyId)
      ),
    });

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    // Check for duplicate submission
    const existingSubmission = await db.query.submissions.findFirst({
      where: and(
        eq(submissions.requestId, requestId),
        eq(submissions.agencyId, user.agencyId),
        eq(submissions.candidateId, candidateId)
      ),
    });

    if (existingSubmission) {
      return NextResponse.json({ error: 'Candidate already submitted for this request' }, { status: 400 });
    }

    // Create submission
    const [newSubmission] = await db
      .insert(submissions)
      .values({
        requestId,
        agencyId: user.agencyId,
        candidateId,
        proposedRate: proposedRate.toString(),
        cvUrl: cvUrl || candidate.cvUrl,
        notes,
        additionalInfo,
        status: 'pending',
      })
      .returning();

    // Update request status to in_review
    await db
      .update(requests)
      .set({ status: 'in_review', updatedAt: new Date() })
      .where(eq(requests.id, requestId));

    // Notify organization
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const emailContent = submissionReceivedNotification({
      organizationName: request.organization?.name || 'Organisatie',
      agencyName: user.agency?.name || 'Bureau',
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      requestTitle: request.title,
      proposedRate: `€ ${proposedRate}`,
      submissionsUrl: `${appUrl}/org/requests/${requestId}`,
    });

    if (request.organization?.contactEmail) {
      await sendEmail({
        to: request.organization.contactEmail,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    }

    return NextResponse.json({ success: true, data: newSubmission });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}

// PATCH /api/submissions - Update submission status (accept/reject)
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
      with: {
        organization: true,
      },
    });

    if (!user || user.role !== 'org_user' || !user.organizationId) {
      return NextResponse.json({ error: 'Only organization users can update submissions' }, { status: 403 });
    }

    const body = await req.json();
    const { submissionId, status, message } = body;

    if (!submissionId || !status || !['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Get submission with related data
    const submission = await db.query.submissions.findFirst({
      where: eq(submissions.id, submissionId),
      with: {
        request: true,
        agency: true,
        candidate: true,
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (submission.request?.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update submission status
    await db
      .update(submissions)
      .set({ status, updatedAt: new Date() })
      .where(eq(submissions.id, submissionId));

    // If accepted, create order confirmation and update request status
    if (status === 'accepted') {
      await db.insert(orderConfirmations).values({
        requestId: submission.requestId,
        submissionId,
        organizationId: user.organizationId,
        agencyId: submission.agencyId,
        candidateId: submission.candidateId,
        agreedRate: submission.proposedRate,
        startDate: submission.request!.startDate,
        endDate: submission.request!.endDate,
      });

      await db
        .update(requests)
        .set({ status: 'filled', updatedAt: new Date() })
        .where(eq(requests.id, submission.requestId));

      // Reject other pending submissions for this request
      await db
        .update(submissions)
        .set({ status: 'rejected', updatedAt: new Date() })
        .where(
          and(
            eq(submissions.requestId, submission.requestId),
            eq(submissions.status, 'pending')
          )
        );
    }

    // Notify agency
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const emailContent = submissionStatusNotification({
      agencyName: submission.agency?.name || 'Bureau',
      candidateName: `${submission.candidate?.firstName} ${submission.candidate?.lastName}`,
      requestTitle: submission.request?.title || 'Aanvraag',
      organizationName: user.organization?.name || 'Organisatie',
      status: status as 'accepted' | 'rejected',
      message,
      dashboardUrl: `${appUrl}/agency/dashboard`,
    });

    if (submission.agency?.contactEmail) {
      await sendEmail({
        to: submission.agency.contactEmail,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}
