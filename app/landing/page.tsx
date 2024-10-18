import { Logos } from '@/app/components/landing/Logos';
import { Hero } from '@/app/components/landing/Hero';
import { Features } from '@/app/components/landing/Features';
import { HowItWorks } from '@/app/components/landing/Works';
import { FAQ } from '@/app/components/landing/FAQ';
import { Footer } from '@/app/components/landing/Footer';
import { PricingTable } from '@/app/components/landing/Pricing';


export default function LandingRoute() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <Hero />
        <Logos />
        <Features />
        <HowItWorks />
        <FAQ />
        <PricingTable />
        <Footer />
      </div>
    </>
  );
}