import Footer from "@/components/Footer"
import Header from "@/components/Header"
import CTA from "@/components/Home/CTA"
import Feature from "@/components/Home/Feature"
import HeroSection from "@/components/Home/HeroSection"

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <HeroSection />
      <Feature />
      <CTA />
      <Footer />
    </div>
  )
}
