import { FinalCTASection } from "@/components/landing/final-cta"
import { FAQSection } from "@/components/landing/faq"
import { HeroSection } from "@/components/landing/hero"
import { HowItWorksSection } from "@/components/landing/how-it-works"
import { IntegrationsSection } from "@/components/landing/integrations"
import { LiveProductPeek } from "@/components/landing/live-peek"
import { OutcomesSection } from "@/components/landing/outcomes"
import { PricingSection } from "@/components/landing/pricing"
import { TestimonialsSection } from "@/components/landing/testimonials"
import { getHomeSpotlight } from "@/lib/landing/get-home-spotlight"

export default async function Home() {
  const spotlight = await getHomeSpotlight()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <HeroSection spotlight={spotlight} />
      <OutcomesSection />
      <HowItWorksSection />
      <LiveProductPeek spotlight={spotlight} />
      <IntegrationsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  )
}
