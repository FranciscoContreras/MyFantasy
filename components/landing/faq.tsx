import { FadeIn } from "@/components/motion/fade-in"
import { FAQAccordion } from "@/components/ui/faq-accordion"

const faqs = [
  {
    question: "How do imports work?",
    answer: "Playwright MCP logs in securely, pulls rosters, scoring settings, and lineups. You can re-sync anytime with one click.",
  },
  {
    question: "How accurate are projections?",
    answer: "We blend historical performance, matchup analytics, and real-time news. Expect updates every 15 minutes and a full audit trail.",
  },
  {
    question: "Do you store my credentials?",
    answer: "No. Credentials pass through secure MCP sessions and are never persisted on our servers.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes. Stop your subscription inside the app. Your data stays available through the end of your billing cycle.",
  },
  {
    question: "Who do I contact for support?",
    answer: "Message us in-app or email support@glassgrid.com. We respond within one business day during the season.",
  },
  {
    question: "Do you support custom scoring?",
    answer: "Absolutely. Import multiple scoring profiles and we’ll mirror them in projections and optimizer outputs.",
  },
]

export function FAQSection() {
  return (
    <section className="py-20">
      <FadeIn className="mx-auto flex max-w-4xl flex-col gap-8 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white sm:text-4xl">
            Answers before you sync.
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Still curious? The help center and live chat are one click away.
          </p>
        </div>
        <FAQAccordion items={faqs} />
      </FadeIn>
    </section>
  )
}
