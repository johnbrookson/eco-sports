"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/sidebar-nav";
import { getNavItemsForPersona, type NavItem } from "@/components/app-sidebar";

// Sidebar mobile do shell autenticado.
// Usa Sheet (drawer) do shadcn, abre pela esquerda.
// Inclui PersonaSwitcher (que é hidden sm: na toolbar) e o section label
// enriquecido pra consistência com o desktop.

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

interface MobileSidebarToggleProps {
  currentPersona?: string;
}

export function MobileSidebarToggle({
  currentPersona = "athlete",
}: MobileSidebarToggleProps) {
  const items = getNavItemsForPersona(currentPersona);
  const section = sectionLabels[currentPersona] ?? sectionLabels.athlete;

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden shrink-0"
            aria-label="Abrir menu"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton
        className="w-[280px] sm:max-w-[280px] bg-sidebar text-sidebar-foreground p-0"
      >
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center px-5 border-b border-sidebar-border">
          <Link
            href="/app"
            className="text-xl font-black tracking-tight"
          >
            Eco-Sports
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="px-3 mb-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-primary">
              {section.title}
            </p>
            <p className="text-[10px] text-sidebar-foreground/40 mt-0.5">
              {section.subtitle}
            </p>
          </div>
          <SidebarNav items={items} />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
