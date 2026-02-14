/**
 * Site Configuration Resolver
 *
 * Standalone ZABAL deployment — always uses defaultSiteConfig (BonfireLanding).
 */
export type {
  BonfireSiteConfigOverrides,
  FeatureFlags,
  NavigationItem,
  SiteConfig,
  ThemeConfig,
} from "./types";

export { defaultSiteConfig } from "./default";
export { rootSiteConfig } from "./root";

import { defaultSiteConfig } from "./default";
import type { BonfireSiteConfigOverrides, SiteConfig } from "./types";

/**
 * Resolve the site config for the current domain.
 */
export function resolveSiteConfig(
  _isSubdomainScoped: boolean,
  _slug?: string | null,
  overrides?: BonfireSiteConfigOverrides | null,
): SiteConfig {
  const base = defaultSiteConfig;

  if (!overrides) return base;

  return {
    ...base,
    theme: { ...base.theme, ...overrides.theme },
    features: { ...base.features, ...overrides.features },
    navigation: overrides.navigation ?? base.navigation,
    landing: base.landing,
  };
}
