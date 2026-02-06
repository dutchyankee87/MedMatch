import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import {
  hourRegistrations,
  orderConfirmations,
  users,
  invoices,
} from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { calculateOrtForPeriod, DEFAULT_ORT_RATES } from '@/lib/ort';
import { sendEmail, hoursSubmittedNotification } from '@/lib/email';

// GET /api/hours - List hour registrations
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

    const allHours = await db.query.hourRegistrations.findMany({
      orderBy: [desc(hourRegistrations.date)],
      with: {
        orderConfirmation: {
          with: {
            candidate: true,
            agency: true,
            organization: true,
          },
        },
      },
    });

    let filteredHours = allHours;
    if (user.role === 'org_user' && user.organizationId) {
      filteredHours = allHours.filter(
        (h) => h.orderConfirmation?.organizationId === user.organizationId
      );
    } else if (user.role === 'agency_user' && user.agencyId) {
      filteredHours = allHours.filter(
        (h) => h.orderConfirmation?.agencyId === user.agencyId
      );
    } else {
      filteredHours = [];
    }

    return NextResponse.json({ success: true, data: filteredHours });
  } catch (error) {
    console.error('Error fetching hours:', error);
    return NextResponse.json({ error: 'Failed to fetch hours' }, { status: 500 });
  }
}

// POST /api/hours - Register hours
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
      return NextResponse.json({ error: 'Only agency users can register hours' }, { status: 403 });
    }

    const body = await req.json();
    const { orderConfirmationId, entries } = body;

    if (!orderConfirmationId || !entries || !Array.isArray(entries)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Verify order confirmation belongs to this agency
    const orderConfirmation = await db.query.orderConfirmations.findFirst({
      where: and(
        eq(orderConfirmations.id, orderConfirmationId),
        eq(orderConfirmations.agencyId, user.agencyId)
      ),
      with: {
        candidate: true,
        organization: true,
      },
    });

    if (!orderConfirmation) {
      return NextResponse.json({ error: 'Order confirmation not found' }, { status: 404 });
    }

    // Insert hour entries
    const insertedHours = [];
    for (const entry of entries) {
      const [newEntry] = await db
        .insert(hourRegistrations)
        .values({
          orderConfirmationId,
          date: entry.date,
          regularHours: entry.regularHours?.toString() || '0',
          ortEvening: entry.ortEvening?.toString() || '0',
          ortNight: entry.ortNight?.toString() || '0',
          ortWeekend: entry.ortWeekend?.toString() || '0',
          ortHoliday: entry.ortHoliday?.toString() || '0',
          notes: entry.notes,
          submittedBy: user.id,
          status: 'pending',
        })
        .returning();
      insertedHours.push(newEntry);
    }

    // Calculate totals for notification
    const totalHours = entries.reduce(
      (sum: number, e: { regularHours?: number; ortEvening?: number; ortNight?: number; ortWeekend?: number }) =>
        sum + (e.regularHours || 0) + (e.ortEvening || 0) + (e.ortNight || 0) + (e.ortWeekend || 0),
      0
    );

    // Notify organization
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const emailContent = hoursSubmittedNotification({
      organizationName: orderConfirmation.organization?.name || 'Organisatie',
      agencyName: user.agency?.name || 'Bureau',
      candidateName: `${orderConfirmation.candidate?.firstName} ${orderConfirmation.candidate?.lastName}`,
      periodStart: entries[0]?.date,
      periodEnd: entries[entries.length - 1]?.date,
      totalHours,
      hoursUrl: `${appUrl}/org/hours`,
    });

    if (orderConfirmation.organization?.contactEmail) {
      await sendEmail({
        to: orderConfirmation.organization.contactEmail,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    }

    return NextResponse.json({ success: true, data: insertedHours });
  } catch (error) {
    console.error('Error registering hours:', error);
    return NextResponse.json({ error: 'Failed to register hours' }, { status: 500 });
  }
}

// PATCH /api/hours - Approve or dispute hours
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== 'org_user' || !user.organizationId) {
      return NextResponse.json({ error: 'Only organization users can approve hours' }, { status: 403 });
    }

    const body = await req.json();
    const { hourIds, status, disputeReason } = body;

    if (!hourIds || !Array.isArray(hourIds) || !status) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (!['approved', 'disputed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Update each hour registration
    for (const hourId of hourIds) {
      const hourReg = await db.query.hourRegistrations.findFirst({
        where: eq(hourRegistrations.id, hourId),
        with: {
          orderConfirmation: true,
        },
      });

      if (!hourReg || hourReg.orderConfirmation?.organizationId !== user.organizationId) {
        continue; // Skip unauthorized entries
      }

      await db
        .update(hourRegistrations)
        .set({
          status,
          approvedBy: status === 'approved' ? user.id : null,
          approvedAt: status === 'approved' ? new Date() : null,
          notes: status === 'disputed' ? disputeReason : hourReg.notes,
          updatedAt: new Date(),
        })
        .where(eq(hourRegistrations.id, hourId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating hours:', error);
    return NextResponse.json({ error: 'Failed to update hours' }, { status: 500 });
  }
}
