import { Coins } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Coins className="h-5 w-5" />
      </div>
      {showText && (
        <span className="text-xl font-bold text-foreground select-none">
          MyTokenHub
        </span>
      )}
    </div>
  );
}
