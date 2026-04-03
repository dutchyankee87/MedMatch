import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { requests, users, organizations, agencies } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { sendEmail, newRequestNotification } from '@/lib/email';

// GET /api/requests - List requests
export async function GET(req: NextRequest) {
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

    let requestsList;

    if (user.role === 'org_user' && user.organizationId) {
      // Organization users see their own requests
      requestsList = await db.query.requests.findMany({
        where: eq(requests.organizationId, user.organizationId),
        orderBy: [desc(requests.createdAt)],
        with: {
          organization: true,
          submissions: true,
        },
      });
    } else if (user.role === 'agency_user') {
      // Agency users see all open requests
      requestsList = await db.query.requests.findMany({
        where: eq(requests.status, 'open'),
        orderBy: [desc(requests.createdAt)],
        with: {
          organization: true,
          submissions: {
            where: user.agencyId ? eq(requests.organizationId, user.agencyId) : undefined,
          },
        },
      });
    } else {
      // Admin sees all
      requestsList = await db.query.requests.findMany({
        orderBy: [desc(requests.createdAt)],
        with: {
          organization: true,
          submissions: true,
        },
      });
    }

    return NextResponse.json({ success: true, data: requestsList });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

// POST /api/requests - Create new request
export async function POST(req: NextRequest) {
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
      return NextResponse.json({ error: 'Only organization users can create requests' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      functionRequired,
      department,
      startDate,
      endDate,
      hoursPerWeek,
      specialRequirements,
      criteria,
      schedulePreferences,
      vacationDates,
      maxTravelDistance,
    } = body;

    // Validate required fields
    if (!title || !functionRequired || !startDate || !endDate || !hoursPerWeek) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create request
    const [newRequest] = await db
      .insert(requests)
      .values({
        organizationId: user.organizationId,
        createdBy: user.id,
        title,
        description,
        functionRequired,
        department,
        startDate,
        endDate,
        hoursPerWeek,
        specialRequirements,
        criteria: criteria || undefined,
        schedulePreferences: schedulePreferences || undefined,
        vacationDates: vacationDates || undefined,
        maxTravelDistance: maxTravelDistance || undefined,
        status: 'open',
        broadcastAt: new Date(),
      })
      .returning();

    // Notify all agencies
    const allAgencies = await db.query.agencies.findMany();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    for (const agency of allAgencies) {
      const emailContent = newRequestNotification({
        agencyName: agency.name,
        organizationName: user.organization?.name || 'Zorgorganisatie',
        requestTitle: title,
        functionRequired,
        startDate: new Date(startDate).toLocaleDateString('nl-NL'),
        endDate: new Date(endDate).toLocaleDateString('nl-NL'),
        hoursPerWeek,
        requestUrl: `${appUrl}/agency/requests/${newRequest.id}`,
      });

      await sendEmail({
        to: agency.contactEmail,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    }

    return NextResponse.json({ success: true, data: newRequest });
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}
