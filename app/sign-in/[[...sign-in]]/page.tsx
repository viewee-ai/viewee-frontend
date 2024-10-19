"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import CustomSignIn from "@/app/components/signIn";
// import Image from "next/image";
// import Icon from "@/data/icon.png";

export default function Page(): JSX.Element | null {
  const router = useRouter();
  const { isSignedIn, getToken } = useAuth(); // Fetch Clerk token

  useEffect(() => {
    // If user is signed in, fetch the JWT and send it to the backend
    const sendTokenToBackend = async () => {
      if (isSignedIn) {
        const token = await getToken(); // Get Clerk token
        console.log("Clerk token:", token);
        if (token) {
          // Send token to backend
          const response = await fetch('http://localhost:8000/protected', {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log("Backend response:", data);
        }
        router.push("/interview");
      }
    };

    sendTokenToBackend();
  }, [isSignedIn, router, getToken]);

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
