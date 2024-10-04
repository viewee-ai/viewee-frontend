/* import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React, { ComponentType } from 'react';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const fetchUser = async () => {
      const user = await currentUser(); // Server-side Clerk method to get the current user

      if (!user) {
        // Redirect to sign-in if not authenticated
        redirect('/sign-in');
      }

      return { user };
    };

    const user = fetchUser();

    if (!user) {
      return null; // This ensures the component doesn't render if the user isn't loaded yet.
    }

    // Pass user data to the component as props
    return <Component {...props} user={user} />;
  };
}
 */
'use client'

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ComponentType } from 'react';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        router.push('/sign-in');
      }
    }, [isSignedIn, isLoaded, router]);

    if (!isLoaded || !isSignedIn) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
}
