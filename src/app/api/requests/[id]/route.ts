import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { requests, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/requests/[id] - Get single request with relations
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = await params;

    const request = await db.query.requests.findFirst({
      where: eq(requests.id, id),
      with: {
        organization: true,
        submissions: {
          with: {
            candidate: true,
            agency: true,
          },
        },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    // Org users can only see their own requests
    if (user.role === 'org_user' && request.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Agency users should only see their own submissions, not other agencies'
    if (user.role === 'agency_user' && user.agencyId) {
      request.submissions = request.submissions.filter(
        (s) => s.agencyId === user.agencyId
      );
    }

    return NextResponse.json({ success: true, data: request });
  } catch (error) {
    console.error('Error fetching request:', error);
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 });
  }
}
