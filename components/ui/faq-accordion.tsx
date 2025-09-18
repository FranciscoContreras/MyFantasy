import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { GlassCard } from "@/components/ui/glass-card"

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <GlassCard className="border-white/40 bg-white/85 p-0 dark:border-white/10 dark:bg-slate-900/60">
      <Accordion type="single" collapsible className="divide-y divide-white/30 dark:divide-white/10">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="px-6">
            <AccordionTrigger className="py-5 text-base font-medium text-slate-800 dark:text-white">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-sm text-slate-600 dark:text-slate-300">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </GlassCard>
  )
}
