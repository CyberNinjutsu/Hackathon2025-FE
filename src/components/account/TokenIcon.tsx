// src/components/ui/TokenIcon.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";

interface TokenIconProps {
  symbol?: string;
  logoURI?: string;
  mint: string; // Used for fallback color generation
  size?: number; // Size in pixels
}

// Helper function to generate a consistent color from the mint address
function colorFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  const hue = Math.abs(h) % 360;
  // Use HSL for a nice color palette
  return `hsl(${hue}deg 70% 40%)`;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ symbol, logoURI, mint, size = 40 }) => {
  const [hasError, setHasError] = useState(false);

  // Show placeholder if logoURI is missing or if the image failed to load
  const showPlaceholder = !logoURI || hasError;
  const placeholderChar = symbol ? symbol.charAt(0).toUpperCase() : "?";

  if (showPlaceholder) {
    return (
      <div
        className="flex items-center justify-center rounded-full font-bold text-white select-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: colorFromString(mint),
          fontSize: `${size * 0.5}px`,
        }}
      >
        {placeholderChar}
      </div>
    );
  }

  return (
    <Image
      src={logoURI}
      alt={`${symbol || mint} logo`}
      width={size}
      height={size}
      className="rounded-full"
      // Set the error state if the image fails to load
      onError={() => setHasError(true)}
    />
  );
};