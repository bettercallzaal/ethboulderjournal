"use client";

import { useEffect, useRef } from "react";

import * as d3 from "d3";

import type { EpisodeActivityBucket } from "@/lib/utils/graph-analytics";

interface ActivityChartProps {
  data: EpisodeActivityBucket[];
  title?: string;
}

export function ActivityChart({ data, title }: ActivityChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 12, right: 16, bottom: 28, left: 32 };
    const width = container.clientWidth;
    const height = 180;

    svg.attr("width", width).attr("height", height);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseDate = d3.timeParse("%Y-%m-%d");
    const parsed = data
      .map((d) => ({ date: parseDate(d.date)!, count: d.count }))
      .filter((d) => d.date != null);

    if (parsed.length === 0) return;

    const x = d3
      .scaleTime()
      .domain(d3.extent(parsed, (d) => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(parsed, (d) => d.count) ?? 1])
      .nice()
      .range([innerHeight, 0]);

    // Area
    const area = d3
      .area<{ date: Date; count: number }>()
      .x((d) => x(d.date))
      .y0(innerHeight)
      .y1((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    // Gradient
    const gradientId = "activity-gradient";
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0")
      .attr("y1", "0")
      .attr("x2", "0")
      .attr("y2", "1");
    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "var(--brand-primary)")
      .attr("stop-opacity", 0.4);
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "var(--brand-primary)")
      .attr("stop-opacity", 0.02);

    g.append("path")
      .datum(parsed)
      .attr("fill", `url(#${gradientId})`)
      .attr("d", area);

    // Line
    const line = d3
      .line<{ date: Date; count: number }>()
      .x((d) => x(d.date))
      .y((d) => y(d.count))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(parsed)
      .attr("fill", "none")
      .attr("stroke", "var(--brand-primary)")
      .attr("stroke-width", 2)
      .attr("d", line);

    // X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(Math.min(parsed.length, 6))
          .tickFormat((d) => d3.timeFormat("%b %d")(d as Date)),
      )
      .selectAll("text")
      .attr("fill", "#64748B")
      .attr("font-size", "10px");

    g.selectAll(".domain, .tick line").attr("stroke", "#ffffff10");

    // Y axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(4).tickSize(-innerWidth))
      .selectAll("text")
      .attr("fill", "#64748B")
      .attr("font-size", "10px");

    g.selectAll(".domain").remove();
    g.selectAll(".tick line").attr("stroke", "#ffffff08");

    // Resize observer
    const observer = new ResizeObserver(() => {
      if (!containerRef.current || !svgRef.current) return;
      // Re-render on resize by triggering this effect
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [data]);

  return (
    <div className="bg-[#1a1d22] border border-white/5 rounded-xl p-4">
      {title && (
        <h3 className="text-sm font-medium text-white mb-3">{title}</h3>
      )}
      {data.length === 0 ? (
        <p className="text-[11px] text-[#64748B] text-center py-8">
          No timeline data available
        </p>
      ) : (
        <div ref={containerRef} className="w-full overflow-hidden">
          <svg ref={svgRef} className="w-full" />
        </div>
      )}
    </div>
  );
}
