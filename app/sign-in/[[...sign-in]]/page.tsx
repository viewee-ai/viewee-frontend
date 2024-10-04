"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import CustomSignIn from "@/app/components/signIn";
// import Image from "next/image";
// import Icon from "@/data/icon.png";

export default function Page(): JSX.Element | null {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center gap-12">
      {/* Logo positioned at the top-left */}
      <div className="absolute top-4 left-4">
        {/* <Image src={Icon} alt="Site Logo" width={200} height={200} /> */}
      </div>

      <div>
        <CustomSignIn />
      </div>
    </div>
  );
}
