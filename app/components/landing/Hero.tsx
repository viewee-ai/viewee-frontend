"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroImage from "@/public/demo.png";
import { ThemeToggle } from "./ThemeToggle";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  const handleSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <>
      <div className="relative flex flex-col w-full py-5 mx-auto md:flex-row md:items-center md:justify-between">
        <div className="flex flex-row items-center justify-between text-sm lg:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <h4 className="text-3xl font-semibold">
              View<span className="text-primary-green">ee</span>
            </h4>
          </Link>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        <nav className="hidden md:flex md:justify-end md:space-x-4">
          <ThemeToggle />
          <Button variant="secondary" onClick={handleSignIn}>
            Sign in
          </Button>
          {/* <Button>Sign up</Button> */}
        </nav>
      </div>

      <section className="relative flex items-center justify-center">
        <div className="relative items-center w-full py-12 lg:py-20">
          <div className="text-center">
            <span className="text-sm text-primary-green font-medium tracking-tight bg-primary-green/10 px-4 py-2 rounded-full">
              💻 Your Personal Interview Coach
            </span>

            <h1 className="mt-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-none">
              Ace Your Technical{" "}
              <span className="block text-primary-green font-bold">
                Interviews!
              </span>
            </h1>

            <p className="max-w-xl mx-auto mt-4 text-base font-light lg:text-lg text-muted-foreground tracking-tighter">
              Practice coding interviews 24/7 with our AI interviewer. Get
              instant feedback on your code, communication skills, and
              problem-solving approach. Level up your interview game today!
            </p>
            <div className="flex items-center gap-x-5 w-full justify-center mt-5 ">
              {/* <LoginLink> */}
              <Button variant="secondary" onClick={handleSignIn}>
                Sign in
              </Button>
              {/* </LoginLink> */}
              {/* <RegisterLink> */}
              <Button className="bg-primary-green">Try for free</Button>
              {/* </RegisterLink> */}
            </div>
          </div>

          <div className="relative items-center w-full py-12 mx-auto mt-12">
            <svg
              className="absolute -mt-24 blur-2xl"
              fill="none"
              viewBox="0 0 400 400"
              height="100%"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#1ccc84" />
                  <stop offset="100%" stopColor="#1ccc84" />
                </linearGradient>
                <filter
                  id="filter0_f_10_20"
                  x="-160.333"
                  y="-160.333"
                  width="720.666"
                  height="720.666"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    mode="normal"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="50"
                    result="effect1_foregroundBlur_10_20"
                  />
                </filter>
              </defs>
              <g clipPath="url(#clip0_10_20)">
                <g filter="url(#filter0_f_10_20)">
                  <path
                    d="M128.6 0H0V322.2L106.2 134.75L128.6 0Z"
                    fill="url(#gradient1)"
                  />
                  <path
                    d="M0 322.2V400H240H320L106.2 134.75L0 322.2Z"
                    fill="url(#gradient1)"
                  />
                  <path
                    d="M320 400H400V78.75L106.2 134.75L320 400Z"
                    fill="url(#gradient1)"
                  />
                  <path
                    d="M400 0H128.6L106.2 134.75L400 78.75V0Z"
                    fill="url(#gradient1)"
                  />
                </g>
              </g>
            </svg>

            <Image
              src={HeroImage}
              alt="Interactive coding interview environment"
              priority
              className="relative object-cover w-full border rounded-lg shadow-2xl lg:rounded-2xl"
            />
          </div>
        </div>
      </section>
    </>
  );
}
