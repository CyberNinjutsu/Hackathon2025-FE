import React from "react";
import WordAnimate from "../WordAnimate";

type Step = {
  title: string;
  description: string;
};
const stepsData: Step[] = [
  {
    title: "1. Connect to Your Wallet",
    description:
      "Get your public key to use our excellent functionalities",
  },
  {
    title: "2. Track your own history",
    description: "Manage your transactions with our secure system",
  },
  {
    title: "3. Swap your tokens",
    description:
      "Try swapping with a proper price ",
  },
  {
    title: "4. Track and withdraw",
    description: "Monitor performance and withdraw your assets anytime.",
  },
];

export default function HIW() {
  return (
    <section id="howitworks" className="py-20 sm:py-24">
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

        <div className={`mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-${stepsData.length}`}>
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
