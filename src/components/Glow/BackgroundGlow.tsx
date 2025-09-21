import { CornerGlow } from "./CornerGlow";
import { RandomGlow } from "./RandomGlow";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-1">
      <CornerGlow position="tl" />
      <CornerGlow position="tr" />
      <CornerGlow position="bl" />
      <CornerGlow position="br" />

      <RandomGlow size={400} color="#00ffb2" opacity={0.1} top="30%" left="10%" />
      <RandomGlow size={250} color="#00ffb2" opacity={0.15} bottom="20%" right="15%" />

      <RandomGlow size={300} color="#00ffb2" opacity={0.1} random />
      <RandomGlow size={200} color="#00ffb2" opacity={0.2} random />
    </div>
  );
}
