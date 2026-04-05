import Link from "next/link";
import {
  InstagramLogo,
  LinkedinLogo,
  YoutubeLogo,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const platformLinks = [
  { label: "Atletas", href: "/atletas" },
  { label: "Ferramentas", href: "/ferramentas" },
  { label: "Blog", href: "/blog" },
  { label: "Planos", href: "/#pricing" },
  { label: "Para quem", href: "/#audience" },
];

const companyLinks = [
  { label: "Sobre nós", href: "#" },
  { label: "Contato", href: "#" },
  { label: "Carreiras", href: "#" },
];

const legalLinks = [
  { label: "Privacidade", href: "#" },
  { label: "Termos de uso", href: "#" },
  { label: "LGPD", href: "#" },
];

const socialLinks = [
  { icon: InstagramLogo, href: "#", label: "Instagram" },
  { icon: LinkedinLogo, href: "#", label: "LinkedIn" },
  { icon: YoutubeLogo, href: "#", label: "YouTube" },
];

export function SiteFooter() {
  return (
    <footer className="bg-foreground pt-20 pb-10 px-4 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        {/* Top — brand + social */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-14">
          <div>
            <span className="text-3xl font-black tracking-tight text-background">
              Eco-Sports
            </span>
            <p className="mt-2 text-sm leading-relaxed text-background/50 max-w-md">
              A plataforma completa para atletas de categorias de base.
              Gestão de carreira, performance e desenvolvimento integral.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-background/15 text-background/50 hover:bg-background/10 hover:text-background transition-all"
                title={social.label}
              >
                <social.icon weight="fill" className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 mb-12" />

        {/* Grid — links + newsletter */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Platform */}
          <div>
            <p className="text-xs font-bold text-background/40 uppercase tracking-widest mb-5">
              Plataforma
            </p>
            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold text-background/40 uppercase tracking-widest mb-5">
              Empresa
            </p>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold text-background/40 uppercase tracking-widest mb-5">
              Legal
            </p>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-bold text-background/40 uppercase tracking-widest mb-5">
              Newsletter
            </p>
            <p className="text-sm text-background/50 mb-4">
              Receba novidades sobre desenvolvimento esportivo e categorias de base.
            </p>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <EnvelopeSimple
                  weight="duotone"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-background/30"
                />
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  className="pl-9 h-11 bg-background/5 border-background/15 text-background placeholder:text-background/30 text-sm rounded-xl focus:border-primary focus:ring-primary"
                />
              </div>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-xl h-11 w-full"
              >
                Assinar
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-background/30">
            &copy; {new Date().getFullYear()} Ceronify. Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-background/30">
            Feito com dedicação para o esporte brasileiro.
          </p>
        </div>
      </div>
    </footer>
  );
}
