import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/data/faq";

const FAQ: FC = () => {
  return (
    <section className="max-w-2xl mx-auto mb-16">
      <h2 className="text-3xl font-bold text-brand-light mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqData.map((item, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border border-brand-primary/20 rounded-lg px-4 bg-brand-light/5"
          >
            <AccordionTrigger className="text-left text-brand-light hover:no-underline">
              <h3 className="text-sm font-medium">{item.question}</h3>
            </AccordionTrigger>
            <AccordionContent className="text-brand-light/70 text-sm leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
