import React from "react";
import WordAnimate from "../WordAnimate";

type Step = {
  title: string;
  description: string;
};
const stepsData: Step[] = [
  {
    title: "1. Create your account",
    description:
      "Sign up securely and verify your identity to unlock full features.",
  },
  {
    title: "2. Add funds",
    description: "Deposit with your preferred method and get ready to trade.",
  },
  {
    title: "3. Buy, sell, convert",
    description:
      "Execute trades instantly with optimized fees and deep liquidity.",
  },
  {
    title: "4. Track and withdraw",
    description: "Monitor performance and withdraw your assets anytime.",
  },
];
export default function HIW() {
  return (
    <section id="howitworks" className="bg-background py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        {/* === Header của Section === */}
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            <WordAnimate>How It Works</WordAnimate>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            <WordAnimate>
              Start in minutes. Fund, trade, and manage your assets with ease.
            </WordAnimate>
          </p>
        </div>

        {/* === Grid chứa các bước === */}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {stepsData.map((step) => (
            <div
              key={step.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold leading-7 text-foreground">
                <WordAnimate>{step.title}</WordAnimate>
              </h3>
              <p className="mt-2 flex-auto text-base leading-7 text-muted-foreground">
                <WordAnimate>{step.description}</WordAnimate>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
