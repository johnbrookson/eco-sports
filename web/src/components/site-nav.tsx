import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileNav } from "@/components/mobile-nav";

// Top nav compartilhado entre todas as páginas públicas do Eco-Sports.
// Três variantes visuais:
// - `hero`: usada na home. Absoluta, transparente, sobre o gradiente laranja.
// - `primary`: usada em /ferramentas, /blog, /ecossistema, /para-quem e
//   /blog/[slug]. Sticky, fundo laranja, contraste com hero laranja.
// - `dark`: usada em /atletas. Sticky, fundo escuro (profile-surface token)
//   alinhado com a estética editorial da vitrine e dos perfis /atleta/[slug].
//   O token muda por tema — ver globals.css.
//
// O link ativo é marcado via prop `active`. Home não recebe active porque
// não está na lista de abas — o logo já leva à home.

export type SiteNavVariant = "hero" | "primary" | "dark";
export type SiteNavActive =
  | "atletas"
  | "ferramentas"
  | "blog"
  | "ecossistema"
  | "para-quem";

interface SiteNavProps {
  variant: SiteNavVariant;
  active?: SiteNavActive;
}

const links: { id: SiteNavActive; href: string; label: string }[] = [
  { id: "atletas", href: "/atletas", label: "Atletas" },
  { id: "ferramentas", href: "/ferramentas", label: "Ferramentas" },
  { id: "blog", href: "/blog", label: "Blog" },
  { id: "ecossistema", href: "/ecossistema", label: "Ecossistema" },
  { id: "para-quem", href: "/para-quem", label: "Para quem" },
];

interface VariantTokens {
  nav: string;
  logo: string;
  linkBase: string;
  linkActive: string;
  signInBtn: string;
  signUpBtn: string;
  mobile: "hero" | "solid";
}

const variants: Record<SiteNavVariant, VariantTokens> = {
  hero: {
    nav: "absolute top-0 inset-x-0 z-20",
    logo: "text-white",
    linkBase: "text-white/80 hover:text-white transition-colors",
    linkActive: "text-white font-semibold",
    signInBtn:
      "text-white/90 hover:text-white hover:bg-white/10",
    signUpBtn: "bg-white text-primary hover:bg-white/90",
    mobile: "hero",
  },
  primary: {
    nav: "sticky top-0 z-20 bg-primary/[0.85] backdrop-blur-lg border-b border-primary/90",
    logo: "text-primary-foreground",
    linkBase:
      "text-primary-foreground/70 hover:text-primary-foreground transition-colors",
    linkActive: "text-primary-foreground font-semibold",
    signInBtn:
      "text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10",
    signUpBtn:
      "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
    mobile: "solid",
  },
  dark: {
    nav: "sticky top-0 z-20 bg-profile-surface/90 backdrop-blur-lg border-b border-white/10",
    logo: "text-white",
    linkBase: "text-white/70 hover:text-white transition-colors",
    linkActive: "text-white font-semibold",
    signInBtn: "text-white/90 hover:text-white hover:bg-white/10",
    signUpBtn: "bg-white text-profile-surface hover:bg-white/90",
    mobile: "hero",
  },
};

export function SiteNav({ variant, active }: SiteNavProps) {
  const t = variants[variant];
  const navClasses = `flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 lg:px-16 ${t.nav}`;

  return (
    <nav className={navClasses}>
      <Link
        href="/"
        className={`text-2xl font-black tracking-tight ${t.logo}`}
      >
        Eco-Sports
      </Link>

      <div
        className={`hidden md:flex items-center gap-8 text-sm font-medium ${
          variant === "hero"
            ? "text-white/80"
            : variant === "primary"
              ? "text-primary-foreground/70"
              : "text-white/70"
        }`}
      >
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={active === link.id ? t.linkActive : t.linkBase}
          >
            {link.label}
          </Link>
        ))}
        <Link href="/#pricing" className={t.linkBase}>
          Planos
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeSwitcher variant="inline" />
        <Link
          href="/login"
          className={`hidden sm:inline-flex items-center h-7 px-2.5 rounded-[min(var(--radius-md),12px)] font-medium text-xs sm:text-sm transition-colors ${t.signInBtn}`}
        >
          Entrar
        </Link>
        <Button
          size="sm"
          className={`hidden sm:inline-flex font-bold rounded-full px-4 sm:px-6 text-xs sm:text-sm ${t.signUpBtn}`}
        >
          Cadastrar
        </Button>
        <MobileNav variant={t.mobile} />
      </div>
    </nav>
  );
}
