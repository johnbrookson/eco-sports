"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/ferramentas", label: "Ferramentas" },
  { href: "/blog", label: "Blog" },
  { href: "/ecossistema", label: "Ecossistema" },
  { href: "/para-quem", label: "Para quem" },
];

interface MobileNavProps {
  variant?: "hero" | "solid";
}

export function MobileNav({ variant = "solid" }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isHero = variant === "hero";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={`md:hidden flex items-center justify-center h-9 w-9 rounded-lg transition-colors ${
          isHero
            ? "text-white/90 hover:bg-white/10"
            : "text-primary-foreground/90 hover:bg-primary-foreground/10"
        }`}
        aria-label="Abrir menu"
      >
        <List weight="bold" className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-72 p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b">
            <SheetTitle className="text-xl font-black tracking-tight">
              Eco-Sports
            </SheetTitle>
          </div>

          {/* Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="px-6 py-6 border-t space-y-3">
            <Button
              variant="outline"
              className="w-full rounded-full font-semibold"
              onClick={() => setOpen(false)}
            >
              Entrar
            </Button>
            <Button
              className="w-full rounded-full font-bold"
              onClick={() => setOpen(false)}
            >
              Cadastrar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
