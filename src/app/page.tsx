import Header from "@/components/Home/Header";
import AllCryptos from "@/components/Home/AllCryptos";
import CTA from "@/components/Home/CTA";
import Faq from "@/components/Home/Faq";
import Features from "@/components/Home/Features";

import HeroSection from "@/components/Home/HeroSection";
import HIW from "@/components/Home/HIW";
import Intro from "@/components/Home/Intro";
import Testimonials from "@/components/Home/Testimonials";
import Footer from "@/components/Home/Footer";

export default function TokenExchangePage() {
  return (
      <>
        {/* Hero Section */}
        <HeroSection />
        <Intro />
        <Features />

      <AllCryptos />
      <HIW />
      <Testimonials />
      <Faq />
      <CTA />
      </>
  );
}
