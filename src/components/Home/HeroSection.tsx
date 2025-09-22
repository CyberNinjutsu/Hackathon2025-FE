"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Image from "next/image";
import dashboard from "@/assets/dashboard.png";
import WordAnimate from "../WordAnimate";

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <Star
    className={`h-4 w-4 text-foreground ${
      filled ? "fill-current" : "fill-current/30"
    }`}
  />
);

export default function HeroSection() {
  return (
    <section className="relative px-6 pt-32 pb-20 overflow-hidden md:pt-40 md:pb-24">
      <div className="max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto mb-10">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6 text-foreground">
            <WordAnimate>Take Control of</WordAnimate>
            <WordAnimate>Your Digital Assets</WordAnimate>
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            <WordAnimate>
              DAMS offers a seamless, secure experience for managing your
              digital assets.
            </WordAnimate>
            <WordAnimate>
              Instant transactions, optimized fees, and premium design.
            </WordAnimate>
          </p>
        </div>

        <div className="mb-10">
          <Button
            size="lg"
            className="h-14 text-lg bg-[#00ffb2]
             text-black shadow-[0_0_34px_rgba(0,255,178,0.3)] 
             transition-transform hover:scale-105 hover:bg-[#00ffb2]/90 rounded-full"
            asChild
          >
            <a href="/login">Get started now</a>
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2 mb-16">
          <p className="text-sm text-muted-foreground">They trust us</p>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon filled={false} />
            </div>
            <span className="font-medium text-foreground">4,9</span>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Image
            src={dashboard}
            alt="DAMS Dashboard Preview"
            priority
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}
