"use client";

import React, { useEffect, useRef } from "react";
import type { JSX } from "react";

interface WordAnimateProps {
  as?: keyof JSX.IntrinsicElements; // Cho phép chọn thẻ: h1, h2, p, button...
  className?: string;
  children: React.ReactNode;
}

const WordAnimate: React.FC<WordAnimateProps> = ({
  as: Tag = "span",
  className = "",
  children,
}) => {
  const ref = useRef<HTMLElement | null>(null);

  // --- Wrap text into words ---
  function wrapTextInWords(element: HTMLElement) {
    const text = element.textContent || "";
    const words = text.split(/\s+/).filter((w) => w !== "");
    element.innerHTML = "";

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      span.style.animationDelay = `${index * 0.1}s`;
      element.appendChild(span);

      if (index < words.length - 1) {
        element.appendChild(document.createTextNode(" "));
      }
    });
  }

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    wrapTextInWords(element);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return React.createElement(
    Tag,
    { ref, className: `word-animate ${className}` },
    children,
  );
};

export default WordAnimate;
