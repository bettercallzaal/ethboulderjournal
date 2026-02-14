import { Background } from "@/components/background";
import { Navbar } from "@/components/navbar";
import { OrgSwitchGuard } from "@/components/subdomain/OrgSwitchGuard";
import { SubdomainResolver } from "@/components/subdomain/SubdomainResolver";
import { SiteConfigProvider } from "@/contexts";

import { Providers } from "../providers";

const hasClerk = (
  process.env["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"] ?? ""
).startsWith("pk_");

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubdomainResolver>
      <Providers>
        <SiteConfigProvider>
          <Background>
            <Navbar />
            {hasClerk ? (
              <OrgSwitchGuard>{children}</OrgSwitchGuard>
            ) : (
              children
            )}
          </Background>
        </SiteConfigProvider>
      </Providers>
    </SubdomainResolver>
  );
}
