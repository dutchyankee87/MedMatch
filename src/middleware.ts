import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/login(.*)',
  '/auth/register(.*)',
  '/api/webhooks(.*)',
]);

const isOrgRoute = createRouteMatcher(['/org(.*)']);
const isAgencyRoute = createRouteMatcher(['/agency(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const pathname = req.nextUrl.pathname;

  // Role-based routing helper
  const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  const userRole = metadata?.role;

  // If logged in and on home page or auth pages, redirect to dashboard
  if (userId && (pathname === '/' || pathname.startsWith('/auth/'))) {
    if (userRole === 'agency_user') {
      return NextResponse.redirect(new URL('/agency/dashboard', req.url));
    }
    // Default to org dashboard
    return NextResponse.redirect(new URL('/org/dashboard', req.url));
  }

  // Allow public routes for non-logged-in users
  if (isPublicRoute(req)) {
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
