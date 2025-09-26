import { Loader2 } from "lucide-react";

export default function LoadingComponent() {
  return (
    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-3xl">
      <Loader2 className="w-8 h-8 text-white animate-spin" />
    </div>
  );
}