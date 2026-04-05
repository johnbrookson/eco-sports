import Link from "next/link";
import { User, LayoutDashboard, BarChart3, LogOut } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/dal";
import { signOut } from "@/lib/auth/actions";
import { PersonaSwitcher } from "./persona-switcher";

// Shell autenticado do SaaS — envolve tudo sob /app/*.
// Estrutura: sidebar fixa à esquerda + topbar superior com persona switcher
// cosmético + área principal rolável. Herda o root layout (html/body/Inter).
// Quem protege é o proxy.ts; quem autoriza é o DAL dentro de cada handler.

const navItems = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/perfil", label: "Perfil", icon: User },
  { href: "/app/performance", label: "Performance", icon: BarChart3 },
];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // verifySession + getCurrentUser: se chegou aqui sem sessão, o DAL redireciona.
  // O proxy.ts já teria barrado, mas esta é a camada autoritativa.
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-card">
        <div className="px-6 py-6">
          <Link
            href="/app"
            className="inline-block text-xl font-black tracking-tight hover:text-primary transition-colors"
          >
            Eco-Sports
          </Link>
        </div>
        <nav className="flex-1 px-3 pb-6">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border px-3 py-4">
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4 gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <Link
                href="/app"
                className="lg:hidden text-lg font-black tracking-tight"
              >
                Eco-Sports
              </Link>
              <PersonaSwitcher currentRole={user.roles[0] ?? "athlete"} />
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <div className="text-right hidden sm:block min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {user.name}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm shrink-0">
                {user.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
