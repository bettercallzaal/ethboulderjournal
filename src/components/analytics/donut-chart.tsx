const COLORS = [
  "var(--brand-primary)",
  "#4fc5ff",
  "#34d399",
  "#a78bfa",
  "#f472b6",
  "#fbbf24",
  "#fb923c",
  "#94A3B8",
];

interface DonutChartItem {
  label: string;
  value: number;
}

interface DonutChartProps {
  data: DonutChartItem[];
  title?: string;
}

export function DonutChart({ data, title }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  // Build conic-gradient stops
  let accumulated = 0;
  const gradientStops = data.map((item, i) => {
    const start = accumulated;
    const end = accumulated + (item.value / total) * 360;
    accumulated = end;
    return `${COLORS[i % COLORS.length]} ${start}deg ${end}deg`;
  });

  const gradient =
    data.length > 0
      ? `conic-gradient(${gradientStops.join(", ")})`
      : "conic-gradient(#1a1d22 0deg 360deg)";

  return (
    <div className="bg-[#1a1d22] border border-white/5 rounded-xl p-4">
      {title && (
        <h3 className="text-sm font-medium text-white mb-4">{title}</h3>
      )}
      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative shrink-0">
          <div
            className="w-28 h-28 rounded-full"
            style={{ background: gradient }}
          />
          <div className="absolute inset-3 bg-[#1a1d22] rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-white">{total}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-1.5 overflow-hidden">
          {data.slice(0, 8).map((item, i) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: COLORS[i % COLORS.length],
                }}
              />
              <span className="text-[11px] text-[#94A3B8] capitalize truncate">
                {item.label}
              </span>
              <span className="text-[11px] font-medium text-white ml-auto shrink-0">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
      {data.length === 0 && (
        <p className="text-[11px] text-[#64748B] text-center py-4">
          No data available
        </p>
      )}
    </div>
  );
}
