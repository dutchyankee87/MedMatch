import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent, clerkClient } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users, organizations, agencies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env');
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Webhook verification failed', { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;
    const email = email_addresses[0]?.email_address;
    const role = (unsafe_metadata?.role as string) || 'org_user';

    if (!email) {
      return new Response('No email found', { status: 400 });
    }

    try {
      // Create user in database
      await db.insert(users).values({
        clerkId: id,
        email,
        firstName: first_name || null,
        lastName: last_name || null,
        role: role as 'admin' | 'org_user' | 'agency_user',
      });

      // Update Clerk's publicMetadata with the role so middleware can read it
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(id, {
        publicMetadata: {
          role: role,
        },
      });

      console.log(`User ${id} created with role ${role}`);
    } catch (error) {
      console.error('Failed to create user:', error);
      return new Response('Failed to create user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;

    if (!email) {
      return new Response('No email found', { status: 400 });
    }

    try {
      await db
        .update(users)
        .set({
          email,
          firstName: first_name || null,
          lastName: last_name || null,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, id));

      console.log(`User ${id} updated`);
    } catch (error) {
      console.error('Failed to update user:', error);
      return new Response('Failed to update user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    if (!id) {
      return new Response('No user ID found', { status: 400 });
    }

    try {
      await db.delete(users).where(eq(users.clerkId, id));
      console.log(`User ${id} deleted`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      return new Response('Failed to delete user', { status: 500 });
    }
  }

  return new Response('Webhook processed', { status: 200 });
}
