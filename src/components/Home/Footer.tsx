import { Coins } from "lucide-react";
import Link from "next/link";
import React from "react";

const footerLinks = [
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

const FooterLogo = () => (
  <Link href="https://github.com/CyberNinjutsu/Hackathon2025-FE" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mb-6">
    <Coins className="h-7 w-7 text-primary" />
    <span className="text-xl font-bold text-foreground">DAMS</span>
  </Link>
);

export default function Footer() {
  // Determine grid columns based on number of footer sections
  const getGridCols = () => {
    const byCount: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
    };
    const count = Math.min(footerLinks.length, 6);
    return byCount[count] ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 py-20 lg:grid-cols-2">
          {/* FooterLogo Column */}
          <div className="flex flex-col items-center">
            <FooterLogo />
            <div className="space-y-3 flex flex-col">
              <p className="inline max-w-sm text-muted-foreground text-center">
                Secure, fast, and seamless crypto trading.
              </p>
              <p className="inline max-w-sm text-muted-foreground text-center">
                DAMS makes digital assets effortless.
              </p>
              <p className="inline text-sm text-muted-foreground text-center">
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

          </div>

          {/* Dynamic Links Grid */}
          <div className='flex item-center justify-center'>
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