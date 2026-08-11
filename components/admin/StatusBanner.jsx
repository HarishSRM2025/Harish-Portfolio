import { CheckCircle2, AlertCircle } from "lucide-react";

export default function StatusBanner({ status }) {
  if (!status || status.type === "idle") return null;

  const isError = status.type === "error";

  return (
    <div
      className={`flex items-center gap-2 text-sm rounded-lg px-3.5 py-2.5 mb-4 border ${
        isError
          ? "border-red-500/30 text-red-500 bg-red-500/10"
          : "border-primary/30 text-primary bg-primary/10"
      }`}
    >
      {isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
      {status.message}
    </div>
  );
}
