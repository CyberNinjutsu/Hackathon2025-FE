import React from "react";

export function CornerGlow({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const baseStyle =
    "absolute w-[300px] h-[300px] bg-[#00ffb2]/20 blur-3xl rounded-full";
  const positions: Record<typeof position, string> = {
    tl: "-top-[150px] -left-[150px]",
    tr: "-top-[150px] -right-[150px]",
    bl: "-bottom-[150px] -left-[150px]",
    br: "-bottom-[150px] -right-[150px]",
  };

  return <div className={`${baseStyle} ${positions[position]}`} />;
}