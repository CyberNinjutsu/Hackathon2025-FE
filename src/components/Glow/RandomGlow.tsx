"use client"
import { useEffect, useState } from "react";
export function RandomGlow({
  size = 200,
  color = "#00ffb2",
  opacity = 0.2,
  top,
  left,
  right,
  bottom,
  random = false,
}: {
  size?: number;
  color?: string;
  opacity?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  random?: boolean;
}) {
  const [pos, setPos] = useState<{ top?: string; left?: string }>({});
  useEffect(() => {
    if (!random) return;
    // Compute only on client to avoid SSR mismatch
    setPos({
      top: `${Math.floor(Math.random() * 80)}%`,
      left: `${Math.floor(Math.random() * 80)}%`,
    });
  }, [random]);

  const style: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: color,
    opacity: opacity,
    top,
    left,
    right,
    bottom,
    ...pos,
  };

  return (
    <div
      className="absolute blur-3xl rounded-full"
      style={style}
      aria-hidden="true"
      role="presentation"
    />
  );}
