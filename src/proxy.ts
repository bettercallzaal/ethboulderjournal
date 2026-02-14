/**
 * Authentication Proxy / Middleware
 *
 * When Clerk keys are configured, uses clerkMiddleware for route protection.
 * When Clerk is not configured, passes all requests through with subdomain handling.
 */
import { type NextRequest, NextResponse } from "next/server";

const clerkKey = process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] ?? "";
const hasClerk = clerkKey.startsWith("pk_");

/**
 * Subdomain override logic for Vercel preview URLs and local development.
 * Uses ?subdomain= param on first visit, then persists via cookie.
 * Clear with ?subdomain= (empty value) to return to root domain view.
 */
function handleSubdomainOverride(req: NextRequest): NextResponse | null {
  const host = req.headers.get("host") ?? "";
  const isLocalhost =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const isVercelPreview = host.endsWith(".vercel.app");

  if (isVercelPreview || isLocalhost) {
    const subdomainParam = req.nextUrl.searchParams.get("subdomain");
    const subdomainCookie = req.cookies.get("x-subdomain-override")?.value;

    // Explicit empty ?subdomain= clears the cookie
    if (subdomainParam !== null && subdomainParam === "") {
      const response = NextResponse.next();
      response.cookies.delete("x-subdomain-override");
      return response;
    }

    const subdomain = subdomainParam ?? subdomainCookie;

    if (subdomain) {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-subdomain-override", subdomain);
      const response = NextResponse.next({
        request: { headers: requestHeaders },
      });
      if (subdomainParam) {
        response.cookies.set("x-subdomain-override", subdomainParam, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24, // 1 day
        });
      }
      return response;
    }

    return NextResponse.next();
  }

  return null;
}

/**
 * Build the middleware handler based on whether Clerk is configured
 */
async function buildMiddleware(): Promise<
  (req: NextRequest) => NextResponse | Promise<NextResponse | void>
> {
  if (hasClerk) {
    // Dynamically import Clerk only when keys are present
    const { clerkMiddleware, createRouteMatcher } = await import(
      "@clerk/nextjs/server"
    );

    const isProtectedRoute = createRouteMatcher([
      "/dashboard(.*)",
      "/documents(.*)",
      "/bonfire-settings(.*)",
      "/profile(.*)",
    ]);

    return clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
      return handleSubdomainOverride(req) ?? undefined;
    }) as (req: NextRequest) => NextResponse | Promise<NextResponse | void>;
  }

  // No Clerk — just handle subdomain overrides
  return (req: NextRequest) => {
    return handleSubdomainOverride(req) ?? NextResponse.next();
  };
}

// Cache the middleware handler so we only build it once
let middlewareHandler: ReturnType<typeof buildMiddleware> | null = null;

export default async function middleware(req: NextRequest) {
  if (!middlewareHandler) {
    middlewareHandler = buildMiddleware();
  }
  const handler = await middlewareHandler;
  return handler(req);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
