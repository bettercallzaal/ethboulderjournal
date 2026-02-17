import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color?: string;
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-[#1a1d22] border border-white/5 rounded-xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color ?? "var(--brand-primary)"}20` }}
      >
        <Icon
          className="w-5 h-5"
          style={{ color: color ?? "var(--brand-primary)" }}
        />
      </div>
      <div>
        <p className="text-lg font-bold text-white">{value}</p>
        <p className="text-[11px] text-[#64748B]">{label}</p>
      </div>
    </div>
  );
}
