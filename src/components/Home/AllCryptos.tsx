"use client";
import { Button } from "@/components/ui/button";
import { CryptoCard } from "@/components/ui/crypto-card";
import { cryptos } from "@/lib/crypto-mock-data";
import { cn } from "@/lib/utils";
import { MoveRight } from "lucide-react";
import React from "react";
import WordAnimate from "../WordAnimate";

const MarqueeRow = ({
  items,
  reverse = false,
}: {
  items: typeof cryptos;
  reverse?: boolean;
}) => (
  <div className="relative flex overflow-hidden">
    <div
      className={cn(
        "flex min-w-full flex-shrink-0 items-center justify-around gap-4",
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      )}
    >
      {/* Thủ thuật nhân đôi mảng để animation mượt mà */}
      {[...items, ...items].map((crypto, index) => (
        <CryptoCard key={`${crypto.ticker}-${index}`} {...crypto} />
      ))}
    </div>
  </div>
);

export default function AllCryptos() {
  const row1 = [...cryptos].sort(() => 0.5 - Math.random());
  const row2 = [...cryptos].sort(() => 0.5 - Math.random());
  const row3 = [...cryptos].sort(() => 0.5 - Math.random());
  const row4 = [...cryptos].sort(() => 0.5 - Math.random());
  return (
    <section
      id="allcryptos"
      className="w-full overflow-hidden bg-background py-20 sm:py-24"
    >
      <div className="container mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 lg:gap-20">
        {/* === Cột trái: Nội dung Text === */}
        <div className="flex flex-col items-start justify-center rounded-2xl bg-card p-8 lg:p-12">
          <h2 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl lg:leading-tight">
            <WordAnimate>All Cryptos, One Platform</WordAnimate>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            <WordAnimate>
              Buy, sell, and convert all major cryptocurrencies on a single
              platform. A seamless experience with no compromises.
            </WordAnimate>
          </p>
          <Button
            variant="link"
            className="group mt-8 p-0 text-lg text-primary hover:text-primary/90 hover:no-underline"
          >
            <WordAnimate> Buy crypto now</WordAnimate>
            <MoveRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* === Cột phải: Marquee Cards === */}
        <div className="relative flex h-full max-w-full flex-col justify-center gap-4">
          <MarqueeRow items={row1} />
          <MarqueeRow items={row2} reverse />
          <MarqueeRow items={row3} />
          <MarqueeRow items={row4} reverse />

          {/* Lớp phủ mờ dần (Fading effect) */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
