"use client";

import { useRef, useState, useEffect } from "react";

import { ChevronDown, Flame } from "lucide-react";

import { useBonfireSelection } from "@/contexts/BonfireSelectionContext";

export function BonfireToggle() {
  const { active, options, setActive } = useBonfireSelection();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-colors bg-[#22252B]/60"
      >
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: active.color }}
        />
        <span className="text-xs font-medium text-white">
          {active.label}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-[#64748B] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 min-w-[180px] bg-[#22252B] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setActive(option.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left transition-colors ${
                active.id === option.id
                  ? "bg-white/5 text-white"
                  : "text-[#94A3B8] hover:bg-white/5 hover:text-white"
              }`}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: option.color }}
              />
              <span className="text-xs font-medium">{option.label}</span>
              {active.id === option.id && (
                <Flame className="w-3 h-3 ml-auto" style={{ color: option.color }} />
              )}
            </button>
          ))}

          {/* Coming soon placeholder */}
          <div className="border-t border-white/5 px-4 py-2.5 flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10 shrink-0" />
            <span className="text-[11px] text-[#64748B] italic">
              More graphs coming soon
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
