import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

export default function Dropdown({
  trigger,
  placement = "end",
  className,
  children,
}: {
  trigger: (open: boolean, onToggle: () => void) => React.ReactNode;
  placement?: "start" | "end" | "center";
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      )
        return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={cn("relative inline-block", open && "dropdown-open")}
      ref={containerRef}
    >
      {trigger(open, () => setOpen(true))}
      {open && (
        <div
          ref={menuRef}
          id="navbar-dropdown-menu"
          role="menu"
          aria-labelledby="navbar-dropdown-trigger"
          onMouseDown={(e) => e.stopPropagation()}
          className={cn(
            "absolute z-100 mt-1 list-none rounded-lg bg-brand-black shadow-lg border border-[#3B1517]",
            placement === "start" && "left-0",
            placement === "end" && "right-0",
            placement === "center" && "left-1/2 -translate-x-1/2",
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
