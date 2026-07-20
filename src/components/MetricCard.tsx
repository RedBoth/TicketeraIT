import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtext?: string;
  subtextClass?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  subtext,
  subtextClass = "text-slate-500"
}: MetricCardProps) {
  return (
    <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 flex items-start justify-between shadow-lg hover:border-slate-700/50 transition-all select-none">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold mt-2 text-white tracking-tight">{value}</p>
        {subtext && (
          <span className={`text-[11px] mt-1 block ${subtextClass}`}>
            {subtext}
          </span>
        )}
      </div>
      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
        {icon}
      </div>
    </div>
  );
}