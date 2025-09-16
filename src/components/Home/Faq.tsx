import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Minus, Plus } from "lucide-react";
import WordAnimate from "../WordAnimate";

type FaqItemData = {
  question: string;
  answer: string;
};

const faqData: FaqItemData[] = [
  {
    question: "What is Cryptix?",
    answer:
      "Cryptix is a premium crypto trading platform designed for seamless, secure, and efficient management of digital assets. We offer instant transactions, optimized fees, and a user-friendly interface.",
  },
  {
    question: "Is Cryptix secure?",
    answer:
      "Yes, security is our top priority. We use state-of-the-art encryption, multi-factor authentication, and cold storage solutions to protect your assets around the clock.",
  },
  {
    question: "Which cryptocurrencies are supported?",
    answer:
      "We support all major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Solana (SOL), and many more. Our list is constantly expanding based on user demand and market trends.",
  },
  {
    question: "How can I contact support?",
    answer:
      "Our support team is available 24/7. You can reach us via the contact form on our website, email us at support@cryptix.com, or use the live chat feature within the platform for immediate assistance.",
  },
];

const FaqIcon = () => (
  <div className="relative h-6 w-6">
    <Plus className="absolute h-6 w-6 transition-transform duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:scale-0" />
    <Minus className="absolute h-6 w-6 scale-0 transition-transform duration-300 group-data-[state=open]:rotate-0 group-data-[state=open]:scale-100" />
  </div>
);

export default function Faq() {
  const middleIndex = Math.ceil(faqData.length / 2);
  const firstColumn = faqData.slice(0, middleIndex);
  const secondColumn = faqData.slice(middleIndex);

  const FaqColumn = ({ items }: { items: FaqItemData[] }) => (
    <Accordion type="single" collapsible className="w-full">
      {items.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="mb-4 rounded-2xl border bg-card px-6" // Tạo kiểu card cho từng item
        >
          <AccordionTrigger className="group text-left text-lg font-medium hover:no-underline">
            <span className="flex-1 pr-4">{faq.question}</span>
            <FaqIcon />
          </AccordionTrigger>
          <AccordionContent className="pt-2 text-base text-muted-foreground">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <section id="faq" className="bg-background py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        {/* === Header của Section === */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            <WordAnimate>Your Questions, Answered</WordAnimate>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            <WordAnimate>
              Find everything you need to know about Cryptix, from security to
            </WordAnimate>
            <WordAnimate> supported assets.</WordAnimate>
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-4 lg:grid-cols-2">
          <FaqColumn items={firstColumn} />
          <FaqColumn items={secondColumn} />
        </div>
      </div>
    </section>
  );
}
