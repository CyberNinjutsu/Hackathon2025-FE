import { Coins } from "lucide-react"; // Hoặc một icon phù hợp khác
import Link from "next/link";
import React from "react";

const footerLinks = [
  {
    title: "Navigation",
    links: [
      { label: "Why Cryptix?", href: "#why" },
      { label: "Cryptos", href: "#allcryptos" },
      { label: "How it works", href: "#howitworks" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "test",
    links: [{ label: "Why Cryptix?", href: "#why" }],
  },

  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];
const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Coins className="h-7 w-7 text-primary" />
    <span className="text-xl font-bold text-foreground">Cryptix</span>
  </Link>
);

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 py-20 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="my-6 max-w-sm text-muted-foreground">
              Secure, fast, and seamless crypto trading. Cryptix makes digital
              assets effortless.
            </p>
            <p className="text-sm text-muted-foreground">
              Created by{" "}
              <a
                href="https://x.com/uxui_arthur"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Arthur
              </a>{" "}
              in{" "}
              <a
                href="https://www.framer.com?via=arthurdch"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Framer
              </a>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-7 lg:grid-cols-3">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h4 className="mb-6 text-lg font-medium text-foreground">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border py-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Cryptix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
