import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import WordAnimate from "../WordAnimate";

export default function CTA() {
  return (
    <section id="cta" className="py-20 sm:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-border px-6 py-16 text-center sm:px-12 md:py-24">
          <div className="relative z-1 mx-auto max-w-5xl">
            <WordAnimate
              as="h2"
              className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl"
            >
              Ready to take control of your crypto?
            </WordAnimate>
            <WordAnimate
              as="p"
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-700 dark:text-zinc-300"
            >
              Join thousands of users who trust DAMS for secure, seamless, and
              efficient cryptocurrency transactions. Start now and unlock the
              full potential of digital assets.{" "}
            </WordAnimate>

            <div className="mt-10 flex items-center justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/login">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
