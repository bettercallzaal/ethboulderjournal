import { NavigationItem } from "@/components/navbar";

export const navigationItems: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Graph",
    href: "/graph",
  },
  {
    label: "Hyperblogs",
    href: "/hyperblogs",
  },
] as const;
