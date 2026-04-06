"use client";

import Link from "next/link";
import {
  User,
  Users,
  LayoutDashboard,
  BarChart3,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { SidebarNav } from "@/components/sidebar-nav";
import { SidebarUserMenu } from "@/components/sidebar-user-menu";
import { useSidebar } from "@/components/sidebar-context";

// Sidebar do shell autenticado — segue padrão Fuse Layout1:
// logo fixo no topo, nav scrollável no meio, user menu no fundo.
// Dois estados: expandido (280px) e recolhido (64px, só ícones).
// Toggle de recolher/expandir vive na toolbar (SidebarToggle).
// Active state delegado ao SidebarNav (client component com usePathname).

export type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
};

const athleteNavItems: NavItem[] = [
  { id: "dashboard", href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { id: "perfil", href: "/app/perfil", label: "Perfil", icon: User },
  {
    id: "performance",
    href: "/app/performance",
    label: "Performance",
    icon: BarChart3,
  },
];

const guardianNavItems: NavItem[] = [
  { id: "dashboard", href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { id: "atletas", href: "/app/atletas", label: "Meus Atletas", icon: Users },
  {
    id: "aprovacoes",
    href: "/app/aprovacoes",
    label: "Aprovações",
    icon: ShieldCheck,
  },
];

const sectionLabels: Record<string, { title: string; subtitle: string }> = {
  athlete: {
    title: "Painel do Atleta",
    subtitle: "Gestão de carreira e performance",
  },
  parent_guardian: {
    title: "Painel do Responsável",
    subtitle: "Acompanhamento e aprovações",
  },
};

export function getNavItemsForPersona(persona: string): NavItem[] {
  if (persona === "parent_guardian") return guardianNavItems;
  return athleteNavItems;
}

interface AppSidebarProps {
  user: { name: string; email: string };
  currentPersona: string;
}

export function AppSidebar({ user, currentPersona }: AppSidebarProps) {
  const { collapsed } = useSidebar();

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const items = getNavItemsForPersona(currentPersona);
  const section = sectionLabels[currentPersona] ?? sectionLabels.athlete;

  return (
    <aside
      className={`hidden lg:flex lg:shrink-0 lg:flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border sticky top-0 h-screen z-20 transition-[width] duration-200 ${
        collapsed ? "lg:w-16" : "lg:w-[280px]"
      }`}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-5 overflow-hidden border-b border-sidebar-border">
        <Link
          href="/app"
          className="text-xl font-black tracking-tight hover:text-sidebar-primary transition-colors whitespace-nowrap"
        >
          {collapsed ? "ES" : "Eco-Sports"}
        </Link>
      </div>

      {/* Nav scrollável */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {!collapsed && (
          <div className="px-3 mb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-primary">
              {section.title}
            </p>
            <p className="text-[10px] text-sidebar-foreground/40 mt-0.5">
              {section.subtitle}
            </p>
          </div>
        )}
        <SidebarNav items={items} collapsed={collapsed} />
      </nav>

      {/* User menu — pinned bottom */}
      <div className="border-t border-sidebar-border p-3">
        <SidebarUserMenu
          user={user}
          initials={initials}
          collapsed={collapsed}
        />
      </div>
    </aside>
  );
}
