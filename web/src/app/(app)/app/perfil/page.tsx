import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { getCurrentAthlete } from "@/lib/auth/dal";
import { ProfileForm } from "./profile-form";

export const metadata = {
  title: "Meu perfil — Eco-Sports",
};

export default async function ProfilePage() {
  const athlete = await getCurrentAthlete();

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:py-14">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">
            Editar
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            Meu perfil
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Atualize seus dados e controle o que aparece no perfil público.
            Tudo começa desligado — você decide o que expor.
          </p>
        </div>
        {athlete.slug && athlete.visibility.publicProfileEnabled && (
          <Link
            href={`/atleta/${athlete.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold hover:border-primary transition-colors whitespace-nowrap"
          >
            Ver perfil público
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </header>

      <ProfileForm athlete={athlete} />
    </div>
  );
}
