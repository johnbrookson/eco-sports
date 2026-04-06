import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonaSwitcher } from "@/app/(app)/persona-switcher";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { DarkModeToggle } from "@/components/dark-mode-toggle";

// Toolbar do shell autenticado — segue padrão Fuse Layout1:
// sticky top, h-12 mobile / h-16 desktop.
// Esquerda: sidebar toggle + mobile toggle + logo mobile + persona + breadcrumbs.
// Direita: action icons + avatar.

interface AppToolbarProps {
  initials: string;
  currentRole: string;
  mobileToggle?: React.ReactNode;
}

export function AppToolbar({ initials, currentRole, mobileToggle }: AppToolbarProps) {

  return (
    <header className="sticky top-0 z-20 bg-toolbar text-toolbar-foreground border-b border-border">
      <div className="flex items-center justify-between min-h-12 md:min-h-16 px-4 md:px-6 gap-4">
        {/* Esquerda: toggles + logo mobile + persona + breadcrumbs */}
        <div className="flex items-center gap-1.5 min-w-0">
          <SidebarToggle />
          {mobileToggle}
          <Link
            href="/app"
            className="lg:hidden text-lg font-black tracking-tight"
          >
            Eco-Sports
          </Link>
          <div className="hidden sm:flex items-center gap-3 ml-1.5">
            <div className="h-6 w-px bg-border" />
            <PersonaSwitcher currentRole={currentRole} />
          </div>
          <div className="hidden lg:flex items-center gap-3 ml-1.5">
            <div className="h-6 w-px bg-border" />
            <AppBreadcrumbs />
          </div>
        </div>

        {/* Direita: ações + avatar */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden sm:inline-flex text-toolbar-foreground/50 hover:text-toolbar-foreground"
            aria-label="Buscar"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden sm:inline-flex text-toolbar-foreground/50 hover:text-toolbar-foreground"
            aria-label="Notificações"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <DarkModeToggle />
          <div className="h-6 w-px bg-border mx-1" />
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shrink-0">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
