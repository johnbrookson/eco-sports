"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/app-sidebar";

// Client component pra detecção de active state via usePathname().
// Usado tanto no AppSidebar (desktop) quanto no MobileSidebar.
// No modo collapsed, mostra só ícones com title tooltip.

interface SidebarNavProps {
  collapsed?: boolean;
}

export function SidebarNav({ collapsed = false }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/app"
            ? pathname === "/app"
            : pathname.startsWith(item.href);
        return (
          <li key={item.id}>
            <Link
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center rounded-lg text-sm font-medium transition-colors ${
                collapsed
                  ? "justify-center px-0 py-2.5"
                  : "gap-3 px-3 py-2.5"
              } ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
