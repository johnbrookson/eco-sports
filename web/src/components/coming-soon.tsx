import {
  ChartLineUp,
  IdentificationCard,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

import { CourtLines } from "@/components/court-lines";

// Página "Em breve" exibida na home enquanto COMING_SOON está ligado
// (ver lib/launch.ts). Mesma linguagem do hero do perfil do atleta:
// superfície editorial escura, linhas de quadra e título em .display.

const PILLARS = [
  {
    icon: IdentificationCard,
    title: "Perfil de scout",
    text: "Ficha técnica, vídeos e conquistas num perfil público pronto para treinadores e olheiros.",
  },
  {
    icon: ChartLineUp,
    title: "Evolução medida",
    text: "Estatísticas de jogo e avaliações físicas temporada a temporada.",
  },
  {
    icon: ShieldCheck,
    title: "Responsáveis no controle",
    text: "Atletas menores só aparecem com aprovação do responsável, de acordo com a LGPD.",
  },
];

export function ComingSoon() {
  return (
    <main className="relative isolate flex min-h-svh flex-col overflow-hidden bg-profile-surface text-white">
      <CourtLines />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_25%,color-mix(in_oklch,var(--primary)_35%,transparent),transparent_55%)]" />
      <span
        className="display outline-text pointer-events-none absolute -right-6 bottom-10 -z-10 md:bottom-auto md:top-16 select-none text-[34vw] leading-none [--outline-text-color:var(--color-white)] md:text-[22vw]"
        aria-hidden
      >
        BN
      </span>

      <header className="mx-auto w-full max-w-6xl px-6 pt-8 sm:px-10">
        <span className="display text-2xl normal-case tracking-tight">
          basketball.net
        </span>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16 sm:px-10">
        <p className="kicker">Em breve · basquete de base</p>
        <h1 className="display mt-5 max-w-4xl text-5xl sm:text-7xl lg:text-8xl">
          A carreira do atleta de base em um só lugar
        </h1>
        <p className="mt-6 max-w-2xl text-base text-white/70 sm:text-lg">
          Estamos preparando a plataforma para atletas, famílias, treinadores e
          clubes do basquete de formação. Os últimos ajustes estão em andamento.
        </p>

        <ul className="mt-14 grid max-w-5xl gap-8 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="border-t border-white/15 pt-5">
              <Icon className="size-7 text-primary" weight="duotone" aria-hidden />
              <h2 className="mt-3 text-sm font-bold uppercase tracking-[0.18em]">
                {title}
              </h2>
              <p className="mt-2 text-sm text-white/60">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 pb-8 text-xs text-white/50 sm:px-10">
        © {new Date().getFullYear()} Ceronify · basketball.net
      </footer>
    </main>
  );
}
