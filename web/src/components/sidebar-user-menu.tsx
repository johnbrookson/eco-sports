"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronUp, User, LogOut } from "lucide-react";

import { signOut } from "@/lib/auth/actions";

// Menu do usuário no bottom do sidebar.
// Expandido: avatar + nome + email + chevron. Clica e abre popover com ações.
// Recolhido: só avatar. Clica e abre popover com nome + ações.
// Padrão Fuse: "My Profile", "Inbox", "Sign out".

interface SidebarUserMenuProps {
  user: { name: string; email: string };
  initials: string;
  collapsed: boolean;
}

export function SidebarUserMenu({ user, initials, collapsed }: SidebarUserMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center rounded-lg transition-colors hover:bg-sidebar-accent/50 ${
          collapsed
            ? "justify-center py-2 px-0"
            : "gap-3 px-3 py-2"
        }`}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-xs shrink-0">
          {initials}
        </div>
        {!collapsed && (
          <>
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-sm font-semibold truncate">
                {user.name}
              </span>
              <span className="text-xs text-sidebar-foreground/50 truncate">
                {user.email}
              </span>
            </div>
            <ChevronUp className="h-3.5 w-3.5 text-sidebar-foreground/40 ml-auto shrink-0" />
          </>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            className={`absolute z-50 bottom-full mb-2 rounded-xl border border-sidebar-border bg-sidebar shadow-lg overflow-hidden ${
              collapsed ? "left-0 w-56" : "left-0 right-0"
            }`}
          >
            {/* Header com nome — útil especialmente no modo collapsed */}
            <div className="border-b border-sidebar-border px-3 py-2.5">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                {user.email}
              </p>
            </div>
            <ul className="py-1">
              <li>
                <Link
                  href="/app/perfil"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-sidebar-accent/50 transition-colors"
                >
                  <User className="h-4 w-4 text-sidebar-foreground/60" />
                  Meu Perfil
                </Link>
              </li>
              <li>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-sm hover:bg-sidebar-accent/50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-sidebar-foreground/60" />
                    Sair
                  </button>
                </form>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
