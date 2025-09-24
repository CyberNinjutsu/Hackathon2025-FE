// src/components/ui/TokenIcon.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TokenIconProps } from "@/utils/Types";


// Helper function to generate a consistent color from the mint address
function colorFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}deg 70% 40%)`;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ symbol, logo, logoURI, mint, size = 40 }) => {
  const [hasError, setHasError] = useState(false);

  if (logoURI && !hasError) {
    return (
      <Image
        src={logoURI}
        alt={`${symbol || mint} logo`}
        width={size}
        height={size}
        className="rounded-full"
        onError={() => setHasError(true)} 
      />
    );
  }

  if (logo) {
    return (
      <div
        className="flex items-center justify-center rounded-full select-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: `${size * 0.6}px`, 
        }}
      >
        {logo}
      </div>
    );
  }

  const placeholderChar = symbol ? symbol.charAt(0).toUpperCase() : "?";
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
};