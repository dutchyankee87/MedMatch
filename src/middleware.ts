import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/login(.*)',
  '/auth/register(.*)',
  '/api/webhooks(.*)',
  '/demo(.*)',
]);

const isOrgRoute = createRouteMatcher(['/org(.*)']);
const isAgencyRoute = createRouteMatcher(['/agency(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;

  // Role from session claims - configured in Clerk Dashboard to include user.unsafe_metadata.role
  const userRole = (sessionClaims as { role?: string } | undefined)?.role;

  // Allow public routes
  if (isPublicRoute(req)) {
    // Redirect logged-in users from homepage to their dashboard
    if (userId && pathname === '/') {
      if (userRole === 'org_user') {
        return NextResponse.redirect(new URL('/org/dashboard', req.url));
      }
      if (userRole === 'agency_user') {
        return NextResponse.redirect(new URL('/agency/dashboard', req.url));
      }
    }
    return NextResponse.next();
  }

  // Require authentication for all other routes
  if (!userId) {
    const signInUrl = new URL('/auth/login', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect org users trying to access agency routes
  if (isAgencyRoute(req) && userRole === 'org_user') {
    return NextResponse.redirect(new URL('/org/dashboard', req.url));
  }

  // Redirect agency users trying to access org routes
  if (isOrgRoute(req) && userRole === 'agency_user') {
    return NextResponse.redirect(new URL('/agency/dashboard', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
