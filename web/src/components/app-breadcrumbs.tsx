"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

// Breadcrumbs do shell autenticado.
// Gera automaticamente a partir do pathname, com labels em pt-BR.

const labels: Record<string, string> = {
  app: "Início",
  perfil: "Perfil",
  performance: "Performance",
  "em-construcao": "Em construção",
};

export function AppBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Não mostra breadcrumb se estiver na raiz /app
  if (segments.length <= 1) return null;

  const crumbs = segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = labels[segment] ?? segment;
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1 text-xs text-toolbar-foreground/50">
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {crumb.isLast ? (
            <span className="text-toolbar-foreground/80 font-medium">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-toolbar-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
