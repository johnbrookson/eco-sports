import Link from "next/link";

// Layout do grupo (auth) — telas de login, signup, recuperação de senha.
// Minimalista centrado, sem nav do marketing nem do SaaS. Herda o root layout
// (html/body/Inter/data-theme) e envolve as páginas com uma shell comum.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="py-8 px-6">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-block text-xl font-black tracking-tight hover:text-primary transition-colors"
          >
            Eco-Sports
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="px-6 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ceronify · Eco-Sports
        </p>
      </footer>
    </div>
  );
}
