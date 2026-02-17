interface BarChartItem {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  title?: string;
  maxItems?: number;
}

export function BarChart({ data, title, maxItems = 10 }: BarChartProps) {
  const items = data.slice(0, maxItems);
  const maxValue = Math.max(...items.map((d) => d.value), 1);

  return (
    <div className="bg-[#1a1d22] border border-white/5 rounded-xl p-4">
      {title && (
        <h3 className="text-sm font-medium text-white mb-4">{title}</h3>
      )}
      <div className="space-y-2.5">
        {items.map((item) => {
          const pct = Math.round((item.value / maxValue) * 100);
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#94A3B8] capitalize truncate max-w-[60%]">
                  {item.label}
                </span>
                <span className="text-[11px] font-medium text-white">
                  {item.value}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor:
                      item.color ?? "var(--brand-primary)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {data.length === 0 && (
        <p className="text-[11px] text-[#64748B] text-center py-4">
          No data available
        </p>
      )}
    </div>
  );
}
