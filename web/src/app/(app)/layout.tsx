import { GeistSans } from "geist/font/sans";

import { getCurrentUser } from "@/lib/auth/dal";
import { SidebarProvider } from "@/components/sidebar-context";
import { AppSidebar } from "@/components/app-sidebar";
import { AppToolbar } from "@/components/app-toolbar";
import { MobileSidebarToggle } from "@/components/mobile-sidebar";

// Shell autenticado do SaaS — envolve tudo sob /app/*.
// Estrutura inspirada no Fuse Layout1: sidebar sticky (280px, recolhível
// para 64px) à esquerda, toolbar sticky no topo, content area flex.
// Fonte Geist (via CSS variable) sobrescreve Inter dentro deste shell.
// Quem protege é o proxy.ts; quem autoriza é o DAL dentro de cada handler.

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      <div
        className={`${GeistSans.variable} min-h-screen bg-background text-foreground flex`}
        style={{ "--font-sans": "var(--font-geist-sans)" } as React.CSSProperties}
      >
        <AppSidebar user={{ name: user.name, email: user.email }} />

        <div className="flex-1 flex flex-col min-w-0">
          <AppToolbar
            initials={user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
            currentRole={user.roles[0] ?? "athlete"}
            mobileToggle={<MobileSidebarToggle />}
          />

          <main className="relative z-10 flex-1 min-h-0 overflow-auto bg-content-surface">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
