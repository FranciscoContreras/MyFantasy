import { FadeIn } from "@/components/motion/fade-in"
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel"

const testimonials = [
  {
    quote: "Lineup calls take five minutes instead of thirty. The optimizer hit on two upside plays last week.",
    name: "Alex R.",
    context: "Back-to-back champ",
  },
  {
    quote: "Imports just work. I sync three leagues, get matchup notes, and send them straight to group chat.",
    name: "Priya D.",
    context: "Commissioner",
  },
  {
    quote: "Everything I need is in one view—projections, matchup flags, and weather. No more app hopping.",
    name: "Jordan L.",
    context: "DFS finalist",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20">
      <FadeIn className="mx-auto flex max-w-4xl flex-col gap-8 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            Proof from real managers.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Your competition is already leaning on automated imports and smarter projections.
          </p>
        </div>
        <TestimonialCarousel items={testimonials} />
      </FadeIn>
    </section>
  )
}
