import Link from "next/link";

// Layout do route group (profile).
// É um nested layout — o root layout em app/layout.tsx continua envolvendo
// html/body/Inter/data-theme. Aqui montamos o cascavel mínimo do perfil público:
// topbar discreta com o logo e um CTA, e um footer minúsculo com link pro site.
// Nada de sidebar, nada de nav institucional do marketing.

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-white font-black tracking-tight text-lg drop-shadow-sm hover:opacity-80 transition-opacity"
          >
            Eco-Sports
          </Link>
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors"
          >
            Criar meu perfil
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Perfil publicado em
            </p>
            <Link
              href="/"
              className="mt-1 inline-block text-xl font-black tracking-tight hover:text-primary transition-colors"
            >
              Eco-Sports
            </Link>
          </div>
          <div className="flex flex-col sm:items-end gap-1">
            <p className="text-xs text-muted-foreground max-w-sm">
              Plataforma de gestão de carreira e desenvolvimento de atletas
              em categorias de base.
            </p>
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
            >
              Conhecer a plataforma →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
