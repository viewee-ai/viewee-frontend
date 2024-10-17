import { Logos } from '@/app/components/frontend/Logos';
import { Hero } from '@/app/components/frontend/Hero';
import { Features } from '@/app/components/frontend/Features';
import { HowItWorks } from '@/app/components/frontend/Works';
import { FAQ } from '@/app/components/frontend/FAQ';
import { Footer } from '@/app/components/frontend/Footer';
import { PricingTable } from '@/app/components/frontend/Pricing';


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