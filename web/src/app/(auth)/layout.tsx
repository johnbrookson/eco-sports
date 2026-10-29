import Link from "next/link";
import { redirect } from "next/navigation";
import { AppVersion } from "@/components/app-version";
import { getOptionalSession } from "@/lib/auth/dal";

// Layout do grupo (auth) — telas de login, signup, recuperação de senha.
// Minimalista centrado, sem nav do marketing nem do SaaS. Herda o root layout
// (html/body/Inter/data-theme) e envolve as páginas com uma shell comum.
// Quem já tem sessão válida vai direto pro app. Fica aqui, e não no proxy,
// porque só o DAL verifica o cookie de verdade.

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (await getOptionalSession()) {
    redirect("/app");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="py-8 px-6">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/"
            className="inline-block text-xl font-black tracking-tight hover:text-primary transition-colors"
          >
            basketball.net
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="px-6 py-6 text-center space-y-1">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Ceronify · basketball.net
        </p>
        <AppVersion />
      </footer>
    </div>
  );
}
