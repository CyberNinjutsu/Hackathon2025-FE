"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import ava1 from "@/assets/avatar.png";
import ava2 from "@/assets/avatar (1).png";
import ava3 from "@/assets/avatar (2).png";
import WordAnimate from "../WordAnimate";

type Testimonial = {
  avatarSrc: StaticImageData;
  quote: string;
  authorName: string;
  authorTitle: string;
};

const testimonialsData: Testimonial[] = [
  {
    avatarSrc: ava1,
    quote:
      "“Cryptix makes crypto trading effortless. Fast transactions, low fees, and a sleek interface—exactly what I needed.”",
    authorName: "Alex M.",
    authorTitle: "Blockchain Analyst at NovaChain",
  },
  {
    avatarSrc: ava2,
    quote:
      '"The UI is slick and trades are lightning fast. The optimized fees are a huge plus compared to other platforms I\'ve used."',
    authorName: "Sarah L.",
    authorTitle: "Swing Trader",
  },
  {
    avatarSrc: ava3,
    quote:
      '"Love the portfolio tracking. Clean, simple, and powerful. It has completely replaced my old spreadsheet method."',
    authorName: "David C.",
    authorTitle: "Long-term Investor",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonialsData.length) % testimonialsData.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
  };

  return (
    <section id="testimonials" className="bg-background py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            <WordAnimate>Trusted by Crypto Enthusiasts Worldwide</WordAnimate>
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            <WordAnimate>
              Join a growing community of investors who choose Cryptix for
            </WordAnimate>
            <WordAnimate>
              {" "}
              its seamless experience, security, and premium design.
            </WordAnimate>
          </p>
        </div>

        <div className="mt-16 grid min-h-[450px] grid-cols-1 md:grid-cols-3">
          <div className="relative overflow-hidden flex flex-col border border-border bg-black p-12 md:col-span-2">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08)_0%,transparent_70%)]"
            />

            <div className="relative flex-grow">
              {testimonialsData.map((testimonial, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 flex flex-col transition-opacity duration-500 ease-in-out",
                    index === currentIndex ? "opacity-100" : "opacity-0"
                  )}
                  aria-hidden={index !== currentIndex}
                >
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#F7931A]">
                    <Image
                      src={testimonial.avatarSrc}
                      alt={`Avatar of ${testimonial.authorName}`}
                      width={50}
                      height={50}
                      className="h-auto w-auto rounded-full object-cover"
                    />
                  </div>
                  <blockquote className="flex flex-grow items-center text-2xl leading-relaxed text-foreground lg:text-3xl">
                    {testimonial.quote}
                  </blockquote>
                  <div className="mt-auto pt-8">
                    <p className="font-bold text-foreground">
                      {testimonial.authorName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.authorTitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-12 right-12 text-sm text-muted-foreground">
              {currentIndex + 1} / {testimonialsData.length}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex-grow"></div>

            <button
              onClick={handlePrev}
              className="group flex w-full items-center gap-4 border-t border-border p-8 text-muted-foreground transition-colors hover:bg-zinc-800 hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              className="group flex w-full items-center justify-end gap-4 border-t border-border p-8 text-muted-foreground transition-colors hover:bg-zinc-800 hover:text-foreground"
            >
              <span>Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
