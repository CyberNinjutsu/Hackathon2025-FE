"use client";

import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const parseMarkdown = (text: string) => {
    if (!text) return [];

    const lines = text.split("\n");
    const elements: React.ReactElement[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) {
        elements.push(<div key={key++} className="my-2"></div>);
        continue;
      }

      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={key++}
            className="text-lg font-semibold text-white mt-4 mb-2 border-l-4 border-blue-400 pl-3"
          >
            {parseInlineMarkdown(line.substring(4))}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={key++}
            className="text-xl font-semibold text-white mt-6 mb-3 border-l-4 border-blue-500 pl-3"
          >
            {parseInlineMarkdown(line.substring(3))}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={key++}
            className="text-2xl font-bold text-white mt-6 mb-4 border-l-4 border-blue-600 pl-3"
          >
            {parseInlineMarkdown(line.substring(2))}
          </h1>
        );
      }
      // Numbered lists
      else if (/^\s*\d+\.\s+/.test(line)) {
        const match = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
        if (match) {
          const [, indent, num, content] = match;
          const level = Math.floor(indent.length / 4);
          const marginLeft = level * 20 + 16;

          elements.push(
            <li
              key={key++}
              className="mb-2 text-gray-300"
              style={{ marginLeft: `${marginLeft}px` }}
            >
              <span className="font-medium text-blue-400">{num}.</span>{" "}
              {parseInlineMarkdown(content)}
            </li>
          );
        }
      }
      // Bullet lists
      else if (/^\s*[-*+]\s+/.test(line)) {
        const match = line.match(/^(\s*)[-*+]\s+(.*)$/);
        if (match) {
          const [, indent, content] = match;
          const level = Math.floor(indent.length / 4);
          const marginLeft = level * 20 + 16;

          elements.push(
            <li
              key={key++}
              className="mb-1 text-gray-300"
              style={{ marginLeft: `${marginLeft}px` }}
            >
              • {parseInlineMarkdown(content)}
            </li>
          );
        }
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={key++} className="mb-2 text-gray-300 leading-relaxed">
            {parseInlineMarkdown(line)}
          </p>
        );
      }
    }

    return elements;
  };

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    if (!text) return text;

    // Split by markdown patterns and process
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let partKey = 0;

    // Process bold text
    remaining = remaining.replace(/\*\*([^*]+)\*\*/g, (match, content) => {
      const placeholder = `__BOLD_${partKey}__`;
      parts.push(
        <strong key={`bold-${partKey++}`} className="font-bold text-white">
          {content}
        </strong>
      );
      return placeholder;
    });

    // Process italic text
    remaining = remaining.replace(/\*([^*]+)\*/g, (match, content) => {
      const placeholder = `__ITALIC_${partKey}__`;
      parts.push(
        <em key={`italic-${partKey++}`} className="italic text-gray-200">
          {content}
        </em>
      );
      return placeholder;
    });

    // Process inline code
    remaining = remaining.replace(/`([^`]+)`/g, (match, content) => {
      const placeholder = `__CODE_${partKey}__`;
      // Check if it's a wallet address (long alphanumeric string)
      const isWalletAddress =
        content.length > 30 && /^[A-Za-z0-9]+$/.test(content);
      const codeClass = isWalletAddress
        ? "bg-gray-800 px-2 py-1 rounded text-yellow-400 text-xs font-mono break-all"
        : "bg-gray-800 px-2 py-1 rounded text-green-400 text-sm";

      parts.push(
        <code key={`code-${partKey++}`} className={codeClass}>
          {content}
        </code>
      );
      return placeholder;
    });

    // Process positive/negative numbers
    remaining = remaining.replace(
      /([+-])(\d+(?:\.\d+)?)/g,
      (match, sign, number) => {
        const placeholder = `__NUMBER_${partKey}__`;
        const color = sign === "+" ? "text-green-400" : "text-red-400";
        parts.push(
          <span key={`number-${partKey++}`} className={`${color} font-medium`}>
            {sign}
            {number}
          </span>
        );
        return placeholder;
      }
    );

    // Split by placeholders and reconstruct
    const finalParts: React.ReactNode[] = [];
    const placeholderRegex = /__(?:BOLD|ITALIC|CODE|NUMBER)_\d+__/g;
    const textParts = remaining.split(placeholderRegex);
    const placeholders = remaining.match(placeholderRegex) || [];

    for (let i = 0; i < textParts.length; i++) {
      if (textParts[i]) {
        finalParts.push(textParts[i]);
      }
      if (i < placeholders.length) {
        const placeholderIndex = parseInt(
          placeholders[i].match(/\d+/)?.[0] || "0"
        );
        finalParts.push(parts[placeholderIndex]);
      }
    }

    return finalParts.length > 0 ? finalParts : text;
  };

  return (
    <div className={`max-w-none leading-relaxed ${className}`}>
      {parseMarkdown(content)}
    </div>
  );
}

// Component để render danh sách recommendations với markdown
export function MarkdownList({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-3 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20"
        >
          <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-400 text-xs font-bold">{index + 1}</span>
          </div>
          <div className="flex-1">
            <MarkdownRenderer content={item} className="text-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
