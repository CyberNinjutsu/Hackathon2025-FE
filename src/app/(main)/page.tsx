import { GoldChart } from "@/components/GoldChart";
import AllCryptos from "@/components/Home/AllCryptos";
import CTA from "@/components/Home/CTA";
import Faq from "@/components/Home/Faq";
import Features from "@/components/Home/Features";
import HeroSection from "@/components/Home/HeroSection";
import HIW from "@/components/Home/HIW";
import Intro from "@/components/Home/Intro";
import Testimonials from "@/components/Home/Testimonials";

export default function TokenExchangePage() {
  return (
    <>
      <HeroSection />
      {/* <GoldChart /> */}
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
