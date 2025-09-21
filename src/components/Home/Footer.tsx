import { Coins } from "lucide-react";
import Link from "next/link";
import React from "react";

const footerLinks = [
  {
    title: "Navigation",
    links: [
      { label: "Why DAMS?", href: "#why" },
      { label: "Cryptos", href: "#allcryptos" },
      { label: "How it works", href: "#howitworks" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/contact" },
      { label: "Bug Report", href: "/bug-report" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "Telegram", href: "#" },
      { label: "Reddit", href: "#" },
    ],
  },
];

const Logo = () => (
  <Link href="github.com/CyberNinjutsu/Hackathon2025-FE" className="flex items-center gap-2">
    <Coins className="h-7 w-7 text-primary" />
    <span className="text-xl font-bold text-foreground">DAMS</span>
  </Link>
);

export default function Footer() {
  // Determine grid columns based on number of footer sections
  const getGridCols = () => {
    const count = footerLinks.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2";
    if (count === 3) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    if (count === 4) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
    if (count === 5) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5";
    if (count === 6) return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"; // fallback
  };

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 py-20 lg:grid-cols-2">
          {/* Logo Column - Always takes up left side on large screens */}
          <div>
            <Logo />
            <p className="my-6 max-w-sm text-muted-foreground">
              Secure, fast, and seamless crypto trading. DAMS makes digital
              assets effortless.
            </p>
            <p className="text-sm text-muted-foreground">
              Created by{" "}
              <a
                href="github.com/CyberNinjutsu/Hackathon2025-FE"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                CyberNinjutsu/Hackathon2025
              </a>
            </p>
          </div>

          {/* Dynamic Links Grid - Adapts based on number of sections */}
          <div className={`grid gap-8 ${getGridCols()}`}>
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="mb-6 text-lg font-medium text-foreground">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
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
            &copy; {new Date().getFullYear()} Created by{" "}
            <Link 
              href="github.com/CyberNinjutsu/Hackathon2025-FE" 
              className="hover:underline"
            >
              CyberNinjutsu/Hackathon2025
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}