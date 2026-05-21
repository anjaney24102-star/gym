import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MembershipPlans } from "@/components/membership-plans"
import { TrainerCards } from "@/components/trainer-cards"
import { TransformationGallery } from "@/components/transformation-gallery"
import { Testimonials } from "@/components/testimonials"
import { BMICalculator } from "@/components/bmi-calculator"
import { FAQ } from "@/components/faq"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MembershipPlans />
      <TrainerCards />
      <TransformationGallery />
      <Testimonials />
      <BMICalculator />
      <FAQ />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
