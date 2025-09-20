import React from "react";

export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 overflow-hidden z-1">
      <div className="absolute w-[600px] h-[600px] bg-[#00ffb2]/10 blur-3xl rounded-full -top-[300px] -left-[300px]" />
      <div className="absolute w-[600px] h-[600px] bg-[#00ffb2]/10 blur-3xl rounded-full -top-[300px] -right-[300px]" />
      <div className="absolute w-[300px] h-[300px] bg-[#00ffb2]/20 blur-3xl rounded-full -top-[100px] -left-[100px]" />
      <div className="absolute w-[300px] h-[300px] bg-[#00ffb2]/20 blur-3xl rounded-full -top-[100px] -right-[100px]" />
    </div>
  );
}
