'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
// import Image from 'next/image';
// import Icon from '@/data/icon.png';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      router.push('/sign-in');
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) {
    return null; // or a loading spinner
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="relative flex min-h-screen items-center justify-center gap-12">
        <div className="absolute top-4 left-4">
          {/* <Image src={Icon} alt="Site Logo" width={150} height={150} /> */}
        </div>
        <div>
        </div>
      </div>
    </Elements>
  );
}