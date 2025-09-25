import React from "react";
import WordAnimate from "@/components/WordAnimate";

const features = [
  {
    title: "Maximum Security",
    description:
      "Your assets are protected with cutting-edge security protocols.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-12 h-12"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
  },
  {
    title: "Instant Transactions",
    description: "Execute your transactions in real-time, without delays.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-12 h-12"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
  },
  {
    title: "Optimized Fees",
    description: "Benefit from some of the lowest fees on the market. (sử)a",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-12 h-12"
      >
        <polyline points="4 14 10 14 10 20"></polyline>
        <polyline points="20 10 14 10 14 4"></polyline>
        <line x1="14" y1="10" x2="21" y2="3"></line>
        <line x1="3" y1="21" x2="10" y2="14"></line>
      </svg>
    ),
  },
  {
    title: "Friendly, Easy-to-Use Interface",
    description:
      "An elegant, intuitive design that's easy to use, even for beginners.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-12 h-12"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="why" className="px-6 py-20 max-w-[1200px] mx-auto">
      {/* Section Header */}
      <div className="text-center">
        <WordAnimate
          as="h2"
          className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)]"
        >
          Why Choose DAMS?
        </WordAnimate>
        <br />
        <WordAnimate
          as="p"
          className="mt-4 text-lg text-[var(--text-secondary)]"
        >
          Benefits designed to provide a seamless, secure, and accessible
          experience for all users.
        </WordAnimate>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-[var(--dark-card-bg)] border border-[var(--border-color)] rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-2"
          >
            <div className="mb-6 text-[var(--text-primary)]">
              {feature.icon}
            </div>
            <WordAnimate
              as="h3"
              className="text-xl font-medium text-[var(--text-primary)] mb-4"
            >
              {feature.title}
            </WordAnimate>
            <WordAnimate
              as="p"
              className="text-[var(--text-secondary)] leading-relaxed"
            >
              {feature.description}
            </WordAnimate>
          </div>
        ))}
      </div>
    </section>
  );
}
