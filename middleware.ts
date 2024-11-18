import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Include '/landing' as a public route along with other public routes
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sso-callback', '/landing', '/']);
export default clerkMiddleware((auth, req) => {
  // If the request is not to a public route
  if (!isPublicRoute(req)) {
    const { userId } = auth();
    // If the user is not authenticated, redirect them to the sign-in page
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  // Protect all routes except public ones and static files
  matcher: [
    '/((?!.*\\..*|_next|landing).*)', // Protect everything except landing and static files
    '/(api|trpc)(.*)'  // Protect API routes as well
  ],
};