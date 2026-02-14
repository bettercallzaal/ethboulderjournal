import type { Metadata, Viewport } from "next";

import {
  clerkLocalizationConfig,
  customFonts,
  metadataConfig,
  viewportConfig,
} from "@/config";
import { ClerkProvider } from "@clerk/nextjs";
import "@rainbow-me/rainbowkit/styles.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

import "./(styles)/globals.css";

const { laroSoft, dmSans, montserrat } = customFonts;

export const metadata: Metadata = metadataConfig;
export const viewport: Viewport = viewportConfig;

const clerkKey = process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] ?? "";
const hasClerk = clerkKey.startsWith("pk_");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = (
    <html lang="en" suppressHydrationWarning data-theme="dark">
      <body
        className={cn(
          laroSoft.variable,
          dmSans.variable,
          montserrat.variable,
          "font-dm-sans antialiased min-h-dvh"
        )}
      >
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </body>
    </html>
  );

  if (hasClerk) {
    return (
      <ClerkProvider localization={clerkLocalizationConfig}>
        {content}
      </ClerkProvider>
    );
  }

  return content;
}
