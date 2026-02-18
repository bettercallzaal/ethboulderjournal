"use client";

import Link from "next/link";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";

import { NavigationItem } from ".";
import Dropdown from "../ui/dropdown";

/**
 * NavbarButton – dropdown trigger with a menu of links.
 * Uses controlled open state, click-outside to close.
 */
export function NavbarButton({
  isActive = false,
  navigationItem,
}: {
  isActive: boolean;
  navigationItem: NavigationItem;
}) {
  const { label, href, dropdownItems } = navigationItem;

  const buttonClasses = cn(
    "whitespace-nowrap text-sm leading-[1.2] inline-flex items-center gap-1.5 px-4 py-2.5 transition-colors hover:text-dark-s-0 border-b-2",
    isActive
      ? "text-dark-s-0 border-b-brand-primary"
      : "text-dark-s-0/60 border-b-transparent hover:text-dark-s-0/90"
  );

  // No dropdown: render as link
  if (!dropdownItems?.length && href) {
    return (
      <Link
        href={href}
        className={cn(buttonClasses, "cursor-pointer no-underline")}
        target={href.startsWith("http") ? "_blank" : undefined}
      >
        {label}
      </Link>
    );
  }

  return (
    <Dropdown
      placement="start"
      className="min-w-40"
      trigger={(open, onToggle) => (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-haspopup="true"
          className={cn(buttonClasses, "cursor-pointer")}
        >
          {label}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </button>
      )}
    >
      <ul className="list-none py-1">
        {dropdownItems?.map((item) => (
          <li key={item.label} role="none">
            <Link
              href={item.href}
              role="menuitem"
              className="block px-5 py-2.5 text-sm text-dark-s-0/80 no-underline transition-colors hover:bg-white/5 hover:text-dark-s-0"
              target={item.href.startsWith("http") ? "_blank" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </Dropdown>
  );
}
