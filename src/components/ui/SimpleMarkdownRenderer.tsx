"use client";

import React from "react";

interface SimpleMarkdownRendererProps {
  content: string;
  className?: string;
}

export default function SimpleMarkdownRenderer({
  content,
  className = "",
}: SimpleMarkdownRendererProps) {
  if (!content) return null;

  const renderText = (text: string) => {
    // Simple text processing without complex regex
    const lines = text.split("\n");

    return lines.map((line, index) => {
      if (!line.trim()) {
        return <br key={index} />;
      }

      // Check for numbered list
      const numberedMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
      if (numberedMatch) {
        const [, indent, num, content] = numberedMatch;
        const level = Math.floor(indent.length / 4);

        return (
          <div
            key={index}
            className="mb-2"
            style={{ marginLeft: `${level * 20 + 16}px` }}
          >
            <span className="font-medium text-blue-400">{num}.</span>{" "}
            <span className="text-gray-300">{renderInlineText(content)}</span>
          </div>
        );
      }

      // Check for bullet list
      const bulletMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
      if (bulletMatch) {
        const [, indent, content] = bulletMatch;
        const level = Math.floor(indent.length / 4);

        return (
          <div
            key={index}
            className="mb-1"
            style={{ marginLeft: `${level * 20 + 16}px` }}
          >
            <span className="text-gray-300">• {renderInlineText(content)}</span>
          </div>
        );
      }

      // Regular text
      return (
        <div key={index} className="mb-2 text-gray-300 leading-relaxed">
          {renderInlineText(line)}
        </div>
      );
    });
  };

  const renderInlineText = (text: string) => {
    const parts = [];
    const remaining = text;
    let key = 0;

    // Process bold text **text**
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        const beforeText = text.substring(lastIndex, match.index);
        parts.push(<span key={key++}>{beforeText}</span>);
      }

      // Add bold text
      parts.push(
        <strong key={key++} className="font-bold text-white">
          {match[1]}
        </strong>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);

      // Process inline code in remaining text
      const codeRegex = /`([^`]+)`/g;
      let codeLastIndex = 0;
      let codeMatch;
      const codeParts = [];
      let codeKey = 0;

      while ((codeMatch = codeRegex.exec(remainingText)) !== null) {
        // Add text before code
        if (codeMatch.index > codeLastIndex) {
          const beforeCode = remainingText.substring(
            codeLastIndex,
            codeMatch.index
          );
          codeParts.push(<span key={codeKey++}>{beforeCode}</span>);
        }

        // Add code
        const isWalletAddress = codeMatch[1].length > 30;
        codeParts.push(
          <code
            key={codeKey++}
            className={
              isWalletAddress
                ? "bg-gray-800 px-2 py-1 rounded text-yellow-400 text-xs font-mono break-all"
                : "bg-gray-800 px-2 py-1 rounded text-green-400 text-sm"
            }
          >
            {codeMatch[1]}
          </code>
        );

        codeLastIndex = codeMatch.index + codeMatch[0].length;
      }

      // Add remaining text after code processing
      if (codeLastIndex < remainingText.length) {
        const finalText = remainingText.substring(codeLastIndex);
        codeParts.push(<span key={codeKey++}>{finalText}</span>);
      }

      parts.push(...codeParts);
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className={`max-w-none leading-relaxed ${className}`}>
      {renderText(content)}
    </div>
  );
}
