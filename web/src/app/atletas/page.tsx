import Link from "next/link";
import type { Metadata } from "next";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteNav } from "@/components/site-nav";
import { AthleteDirectoryCard } from "@/components/athlete-directory-card";
import {
  searchDiscoverableAthletes,
  listDirectoryFacets,
} from "@/lib/mock/search-athletes";

// Vitrine pública de atletas.
// Server Component puro — filtros vivem em searchParams, o form é GET, e a
// renderização é idempotente por URL. Sem client JS no core.
// Apenas atletas com `visibility.discoverable === true` aparecem aqui.

export const metadata: Metadata = {
  title: "Atletas — Eco-Sports",
  description:
    "Descubra atletas de categorias de base na vitrine pública da Eco-Sports.",
};

const positionLabels: Record<string, string> = {
  point_guard: "Armador",
  shooting_guard: "Ala-armador",
  small_forward: "Ala",
  power_forward: "Ala-pivô",
  center: "Pivô",
};

export default async function AtletasPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    position?: string | string[];
    category?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const q = first(params.q);
  const position = first(params.position);
  const category = first(params.category);

  const hasAnyFilter = Boolean(q || position || category);

  const [results, facets] = await Promise.all([
    searchDiscoverableAthletes({ q, position, category }),
    listDirectoryFacets(),
  ]);

  const featured = hasAnyFilter
    ? []
    : [...results].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

  return (
    <div className="bg-background min-h-screen">
      <SiteNav variant="dark" active="atletas" />

      <section className="relative isolate border-b border-border bg-[#0b0f1a] text-white overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.25) 0, rgba(255,255,255,0.25) 1px, transparent 1px, transparent 14px)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-[#0b0f1a]" />

        <div className="mx-auto max-w-6xl px-6 pt-24 pb-16 md:pt-28 md:pb-20">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">
            Vitrine pública
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
            <span className="block text-white">Descubra</span>
            <span className="block text-primary">atletas em ação</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-white/70 leading-relaxed">
            Perfis públicos de atletas em categorias de base, com bio,
            ficha física, highlights e conquistas. Apenas atletas que
            optaram por aparecer na busca pública.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <form action="/atletas" method="get" className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="q"
                  defaultValue={q ?? ""}
                  placeholder="Buscar por nome…"
                  className="pl-9 h-11"
                />
              </div>
              <div className="flex gap-3">
                <select
                  name="position"
                  defaultValue={position ?? ""}
                  className="flex h-11 flex-1 lg:w-44 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Todas as posições</option>
                  {facets.positions.map((p) => (
                    <option key={p} value={p}>
                      {positionLabels[p] ?? p}
                    </option>
                  ))}
                </select>
                <select
                  name="category"
                  defaultValue={category ?? ""}
                  className="flex h-11 flex-1 lg:w-36 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Todas as categorias</option>
                  {facets.categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Button type="submit" className="h-11 px-6 font-bold shrink-0">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </div>

            {hasAnyFilter && (
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">
                  Filtros ativos:
                </span>
                {q && <Chip>{`"${q}"`}</Chip>}
                {position && (
                  <Chip>{positionLabels[position] ?? position}</Chip>
                )}
                {category && <Chip>{category}</Chip>}
                <Link
                  href="/atletas"
                  className="inline-flex items-center gap-1 text-primary font-bold hover:text-primary/80 transition-colors"
                >
                  <X className="h-3 w-3" />
                  Limpar
                </Link>
              </div>
            )}
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {results.length > 0 ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {results.length === 1
                  ? "1 atleta encontrado"
                  : `${results.length} atletas encontrados`}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((athlete) => (
                <AthleteDirectoryCard key={athlete.id} athlete={athlete} />
              ))}
            </div>
          </>
        ) : hasAnyFilter ? (
          <EmptyStateWithFallback featured={featured} />
        ) : (
          <EmptyStateNoAthletes />
        )}
      </section>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-foreground">
      {children}
    </span>
  );
}

function EmptyStateWithFallback({
  featured,
}: {
  featured: Awaited<ReturnType<typeof searchDiscoverableAthletes>>;
}) {
  return (
    <div>
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
          Nenhum resultado
        </p>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          Não encontramos atletas para esses filtros.
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Tente ajustar os filtros ou ver todos os atletas em destaque abaixo.
        </p>
        <Link
          href="/atletas"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold hover:border-primary transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Limpar filtros
        </Link>
      </div>

      {featured.length > 0 && (
        <>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Em destaque
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((athlete) => (
              <AthleteDirectoryCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyStateNoAthletes() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
        Vitrine em construção
      </p>
      <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
        Ainda não há atletas disponíveis na busca pública.
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Atletas podem optar por aparecer aqui a qualquer momento nas
        configurações de privacidade do perfil.
      </p>
    </div>
  );
}

function first(
  value: string | string[] | undefined,
): string | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0] || undefined;
  return value || undefined;
}
