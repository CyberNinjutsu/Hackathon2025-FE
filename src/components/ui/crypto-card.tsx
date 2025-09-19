import type { Crypto } from "@/lib/crypto-mock-data";
import { cn } from "@/lib/utils";

export const CryptoCard = ({
  name,
  Icon,
  price,
  change,
  iconBgColor,
}: Crypto) => {
  const isPositive = change >= 0;

  return (
    <div
      className={cn(
        "flex flex-shrink-0 items-center gap-3 whitespace-nowrap rounded-full",
        "border border-black/20 px-4 py-2",
        "transition-transform duration-300 hover:-translate-y-1 hover:brightness-90",
        iconBgColor
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full",
          "bg-black/20"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <p className="text-base font-medium text-white/80">{name}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-zinc-300">$</span>
          <span className="font-semibold text-white">{price}</span>
        </div>
      </div>
      <div
        className={cn(
          "ml-auto rounded-full px-2 py-0.5 text-xs font-semibold",
          "bg-white/10 text-white"
        )}
      >
        {isPositive ? "+" : ""}
        {change.toFixed(2)}%
      </div>
    </div>
  );
};
