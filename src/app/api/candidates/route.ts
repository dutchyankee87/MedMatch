import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { candidates, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET /api/candidates - List candidates for agency
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== 'agency_user' || !user.agencyId) {
      return NextResponse.json({ error: 'Only agency users can access candidates' }, { status: 403 });
    }

    const candidatesList = await db.query.candidates.findMany({
      where: eq(candidates.agencyId, user.agencyId),
      orderBy: [desc(candidates.createdAt)],
    });

    return NextResponse.json({ success: true, data: candidatesList });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

// POST /api/candidates - Create new candidate
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user || user.role !== 'agency_user' || !user.agencyId) {
      return NextResponse.json({ error: 'Only agency users can create candidates' }, { status: 403 });
    }

    const body = await req.json();
    const { firstName, lastName, email, phone, function: fn, bigNumber, qualifications, cvUrl, notes } = body;

    if (!firstName || !lastName || !fn) {
      return NextResponse.json({ error: 'Missing required fields (firstName, lastName, function)' }, { status: 400 });
    }

    const [newCandidate] = await db
      .insert(candidates)
      .values({
        agencyId: user.agencyId,
        firstName,
        lastName,
        email: email || undefined,
        phone: phone || undefined,
        function: fn,
        bigNumber: bigNumber || undefined,
        qualifications: qualifications || [],
        cvUrl: cvUrl || undefined,
        notes: notes || undefined,
      })
      .returning();

    return NextResponse.json({ success: true, data: newCandidate });
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json({ error: 'Failed to create candidate' }, { status: 500 });
  }
}
