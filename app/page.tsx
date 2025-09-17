import { LandingCTA } from "@/app/components/landing/cta"
import { LandingFeatures } from "@/app/components/landing/features"
import { LandingHero } from "@/app/components/landing/hero"
import { LandingPricing } from "@/app/components/landing/pricing"
import { LandingTestimonials } from "@/app/components/landing/testimonials"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-slate-100 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <LandingHero />
      <LandingFeatures />
      <LandingTestimonials />
      <LandingPricing />
      <LandingCTA />
    </div>
  )
}
