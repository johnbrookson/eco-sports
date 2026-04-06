"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/sidebar-context";

// Botão de toggle do sidebar, renderizado na toolbar.
// Visível apenas no desktop (sidebar mobile usa Sheet).

export function SidebarToggle() {
  const { collapsed, toggle } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      className="hidden lg:inline-flex text-toolbar-foreground/50 hover:text-toolbar-foreground"
      aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
    >
      {collapsed ? (
        <PanelLeftOpen className="h-4 w-4" />
      ) : (
        <PanelLeftClose className="h-4 w-4" />
      )}
    </Button>
  );
}
