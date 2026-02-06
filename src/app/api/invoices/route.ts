import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import {
  invoices,
  hourRegistrations,
  orderConfirmations,
  users,
} from '@/lib/db/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { calculateOrtForPeriod, DEFAULT_ORT_RATES, formatCurrency } from '@/lib/ort';
import { sendEmail, invoiceGeneratedNotification } from '@/lib/email';

// Generate invoice number
function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}-${random}`;
}

// GET /api/invoices - List invoices
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

    let invoicesList: Awaited<ReturnType<typeof db.query.invoices.findMany>> = [];

    if (user.role === 'org_user' && user.organizationId) {
      invoicesList = await db.query.invoices.findMany({
        where: eq(invoices.organizationId, user.organizationId),
        orderBy: [desc(invoices.createdAt)],
        with: {
          agency: true,
          orderConfirmation: {
            with: {
              candidate: true,
            },
          },
        },
      });
    } else if (user.role === 'agency_user' && user.agencyId) {
      invoicesList = await db.query.invoices.findMany({
        where: eq(invoices.agencyId, user.agencyId),
        orderBy: [desc(invoices.createdAt)],
        with: {
          organization: true,
          orderConfirmation: {
            with: {
              candidate: true,
            },
          },
        },
      });
    } else {
      invoicesList = [];
    }

    return NextResponse.json({ success: true, data: invoicesList });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// POST /api/invoices - Generate invoice from approved hours
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
      return NextResponse.json({ error: 'Only agency users can generate invoices' }, { status: 403 });
    }

    const body = await req.json();
    const { orderConfirmationId, periodStart, periodEnd } = body;

    if (!orderConfirmationId || !periodStart || !periodEnd) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get order confirmation
    const orderConfirmation = await db.query.orderConfirmations.findFirst({
      where: and(
        eq(orderConfirmations.id, orderConfirmationId),
        eq(orderConfirmations.agencyId, user.agencyId)
      ),
      with: {
        candidate: true,
        organization: true,
        agency: true,
      },
    });

    if (!orderConfirmation) {
      return NextResponse.json({ error: 'Order confirmation not found' }, { status: 404 });
    }

    // Get approved hours for the period
    const approvedHours = await db.query.hourRegistrations.findMany({
      where: and(
        eq(hourRegistrations.orderConfirmationId, orderConfirmationId),
        eq(hourRegistrations.status, 'approved'),
        gte(hourRegistrations.date, periodStart),
        lte(hourRegistrations.date, periodEnd)
      ),
    });

    if (approvedHours.length === 0) {
      return NextResponse.json({ error: 'No approved hours found for this period' }, { status: 400 });
    }

    // Calculate totals with ORT
    const hourlyRate = parseFloat(orderConfirmation.agreedRate);
    const registrations = approvedHours.map((h) => ({
      date: new Date(h.date),
      regularHours: parseFloat(h.regularHours),
      ortEvening: parseFloat(h.ortEvening),
      ortNight: parseFloat(h.ortNight),
      ortWeekend: parseFloat(h.ortWeekend),
      ortHoliday: parseFloat(h.ortHoliday),
    }));

    const ortCalc = calculateOrtForPeriod(registrations, hourlyRate, DEFAULT_ORT_RATES);

    // Build line items
    const lineItems: {
      description: string;
      hours: number;
      rate: number;
      ortType?: 'evening' | 'night' | 'weekend' | 'holiday';
      ortMultiplier?: number;
      amount: number;
    }[] = [];

    // Regular hours
    if (ortCalc.totalRegularHours > 0) {
      lineItems.push({
        description: `Reguliere uren (${ortCalc.totalRegularHours}u)`,
        hours: ortCalc.totalRegularHours,
        rate: hourlyRate,
        amount: ortCalc.breakdown.baseAmount,
      });
    }

    // Evening ORT
    if (ortCalc.totalEveningHours > 0) {
      lineItems.push({
        description: `Avondtoeslag 18-22u (${ortCalc.totalEveningHours}u, +22%)`,
        hours: ortCalc.totalEveningHours,
        rate: hourlyRate * (DEFAULT_ORT_RATES.evening - 1),
        ortType: 'evening',
        ortMultiplier: DEFAULT_ORT_RATES.evening,
        amount: ortCalc.breakdown.eveningOrt,
      });
    }

    // Night ORT
    if (ortCalc.totalNightHours > 0) {
      lineItems.push({
        description: `Nachttoeslag 22-06u (${ortCalc.totalNightHours}u, +40%)`,
        hours: ortCalc.totalNightHours,
        rate: hourlyRate * (DEFAULT_ORT_RATES.night - 1),
        ortType: 'night',
        ortMultiplier: DEFAULT_ORT_RATES.night,
        amount: ortCalc.breakdown.nightOrt,
      });
    }

    // Weekend ORT
    if (ortCalc.totalWeekendHours > 0) {
      lineItems.push({
        description: `Weekendtoeslag (${ortCalc.totalWeekendHours}u, +35%)`,
        hours: ortCalc.totalWeekendHours,
        rate: hourlyRate * (DEFAULT_ORT_RATES.weekend - 1),
        ortType: 'weekend',
        ortMultiplier: DEFAULT_ORT_RATES.weekend,
        amount: ortCalc.breakdown.weekendOrt,
      });
    }

    // Holiday ORT
    if (ortCalc.totalHolidayHours > 0) {
      lineItems.push({
        description: `Feestdagentoeslag (${ortCalc.totalHolidayHours}u, +100%)`,
        hours: ortCalc.totalHolidayHours,
        rate: hourlyRate * (DEFAULT_ORT_RATES.holiday - 1),
        ortType: 'holiday',
        ortMultiplier: DEFAULT_ORT_RATES.holiday,
        amount: ortCalc.breakdown.holidayOrt,
      });
    }

    const subtotal = ortCalc.breakdown.baseAmount;
    const ortTotal = ortCalc.breakdown.totalOrt;
    const vatRate = 0.21;
    const vatAmount = (subtotal + ortTotal) * vatRate;
    const total = subtotal + ortTotal + vatAmount;

    // Calculate due date (30 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    // Create invoice
    const [newInvoice] = await db
      .insert(invoices)
      .values({
        invoiceNumber: generateInvoiceNumber(),
        orderConfirmationId,
        agencyId: user.agencyId,
        organizationId: orderConfirmation.organizationId,
        periodStart,
        periodEnd,
        lineItems,
        subtotal: subtotal.toFixed(2),
        ortTotal: ortTotal.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
        total: total.toFixed(2),
        status: 'draft',
        dueDate: dueDate.toISOString().split('T')[0],
      })
      .returning();

    return NextResponse.json({ success: true, data: newInvoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

// PATCH /api/invoices - Send invoice or mark as paid
export async function PATCH(req: NextRequest) {
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await req.json();
    const { invoiceId, action } = body;

    if (!invoiceId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const invoice = await db.query.invoices.findFirst({
      where: eq(invoices.id, invoiceId),
      with: {
        agency: true,
        organization: true,
        orderConfirmation: {
          with: {
            candidate: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (action === 'send') {
      // Only agency can send
      if (user.role !== 'agency_user' || invoice.agencyId !== user.agencyId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      await db
        .update(invoices)
        .set({ status: 'sent', updatedAt: new Date() })
        .where(eq(invoices.id, invoiceId));

      // Notify organization
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const emailContent = invoiceGeneratedNotification({
        organizationName: invoice.organization?.name || 'Organisatie',
        agencyName: invoice.agency?.name || 'Bureau',
        invoiceNumber: invoice.invoiceNumber,
        totalAmount: formatCurrency(parseFloat(invoice.total)),
        dueDate: new Date(invoice.dueDate).toLocaleDateString('nl-NL'),
        invoiceUrl: `${appUrl}/org/invoices`,
      });

      if (invoice.organization?.contactEmail) {
        await sendEmail({
          to: invoice.organization.contactEmail,
          subject: emailContent.subject,
          html: emailContent.html,
        });
      }
    } else if (action === 'mark_paid') {
      // Only organization can mark as paid
      if (user.role !== 'org_user' || invoice.organizationId !== user.organizationId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      await db
        .update(invoices)
        .set({ status: 'paid', paidAt: new Date(), updatedAt: new Date() })
        .where(eq(invoices.id, invoiceId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
