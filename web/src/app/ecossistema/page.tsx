import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  Target,
  Basketball,
  Barbell,
  ChartBar,
  Briefcase,
  Newspaper,
  CurrencyDollar,
  Wallet,
  GraduationCap,
  UsersThree,
  Scales,
  HeartHalf,
  ShieldCheck,
  Strategy,
  Cpu,
  Users,
  Path,
  Plugs,
  ArrowsClockwise,
  Student,
  Stethoscope,
  VideoCamera,
  Handshake,
} from "@phosphor-icons/react/dist/ssr";

/* ─── 4 pillars (hub concept) ─── */
const pillars = [
  {
    icon: <Student weight="duotone" className="h-8 w-8" />,
    title: "Atletas de Base",
    description:
      "O centro do ecossistema. Jovens atletas em formação que buscam evoluir técnica, física e profissionalmente com acompanhamento estruturado.",
    highlights: [
      "Perfil completo com métricas e histórico",
      "Portfólio profissional compartilhável",
      "Planejamento de carreira desde a base",
      "Acesso a oportunidades com clubes e scouts",
    ],
  },
  {
    icon: <Stethoscope weight="duotone" className="h-8 w-8" />,
    title: "Profissionais",
    description:
      "Treinadores, preparadores físicos, psicólogos, nutricionistas, advogados esportivos, videomakers e analistas — conectados ao atleta via marketplace.",
    highlights: [
      "Perfil profissional com portfólio e avaliações",
      "Agendamento e pagamento integrados",
      "Acesso aos dados do atleta para atendimento personalizado",
      "Visibilidade no ecossistema esportivo",
    ],
  },
  {
    icon: <Path weight="duotone" className="h-8 w-8" />,
    title: "Metodologia",
    description:
      "Processos estruturados de desenvolvimento: avaliação, planejamento, execução, medição e correção. Ciclos que se adaptam a cada atleta.",
    highlights: [
      "Ciclos: avaliar → planejar → executar → medir → corrigir",
      "Metas por temporada com revisões periódicas",
      "Microciclos e macrociclos de treinamento",
      "Benchmarking por posição e categoria",
    ],
  },
  {
    icon: <Cpu weight="duotone" className="h-8 w-8" />,
    title: "Tecnologia",
    description:
      "A plataforma que conecta tudo — dashboards, análise de vídeo, portfólio digital, CRM, agendamento e gestão de carreira em um só lugar.",
    highlights: [
      "Dashboards de performance em tempo real",
      "Análise de vídeo com tagueamento e highlights",
      "Matching inteligente atleta-profissional",
      "Comunicação integrada entre stakeholders",
    ],
  },
];

/* ─── Connection flows ─── */
const connections = [
  {
    icon: <ArrowsClockwise weight="duotone" className="h-6 w-6" />,
    from: "Atleta",
    to: "Profissional",
    description:
      "Dados do atleta informam o atendimento. O profissional registra evolução na plataforma. Ciclo contínuo de feedback.",
  },
  {
    icon: <Plugs weight="duotone" className="h-6 w-6" />,
    from: "Metodologia",
    to: "Tecnologia",
    description:
      "Processos metodológicos são digitalizados na plataforma. Cada métrica, avaliação e plano segue o ciclo estruturado.",
  },
  {
    icon: <Handshake weight="duotone" className="h-6 w-6" />,
    from: "Profissional",
    to: "Metodologia",
    description:
      "Especialistas aplicam a metodologia com suas expertises. A plataforma padroniza sem engessar, adaptando ao contexto.",
  },
  {
    icon: <VideoCamera weight="duotone" className="h-6 w-6" />,
    from: "Tecnologia",
    to: "Atleta",
    description:
      "Ferramentas digitais dão visibilidade ao atleta — portfólio, highlights e estatísticas acessíveis a scouts e clubes.",
  },
];

/* ─── Service layers ─── */
const serviceLayers = [
  {
    id: "esportivo",
    title: "Core Esportivo",
    subtitle: "Desenvolvimento técnico, físico e de performance",
    accent: "primary",
    domains: [
      { icon: <Basketball weight="duotone" className="h-6 w-6" />, title: "Desenvolvimento Técnico", count: 5 },
      { icon: <Target weight="duotone" className="h-6 w-6" />, title: "Treinamentos Específicos", count: 3 },
      { icon: <ChartBar weight="duotone" className="h-6 w-6" />, title: "Gestão de Desempenho", count: 5 },
      { icon: <Barbell weight="duotone" className="h-6 w-6" />, title: "Preparação Física", count: 4 },
    ],
  },
  {
    id: "carreira",
    title: "Core de Carreira",
    subtitle: "Planejamento, educação e networking profissional",
    accent: "accent",
    domains: [
      { icon: <Strategy weight="duotone" className="h-6 w-6" />, title: "Gestão de Carreira", count: 6 },
      { icon: <Wallet weight="duotone" className="h-6 w-6" />, title: "Planejamento Financeiro", count: 3 },
      { icon: <GraduationCap weight="duotone" className="h-6 w-6" />, title: "Educação Acadêmica", count: 3 },
      { icon: <UsersThree weight="duotone" className="h-6 w-6" />, title: "Network Profissional", count: 4 },
    ],
  },
  {
    id: "mercado",
    title: "Core de Mercado",
    subtitle: "Visibilidade, imprensa, patrocínio e captação",
    accent: "chart-4",
    domains: [
      { icon: <Briefcase weight="duotone" className="h-6 w-6" />, title: "Marketing e Portfólio", count: 4 },
      { icon: <Newspaper weight="duotone" className="h-6 w-6" />, title: "Assessoria de Imprensa", count: 3 },
      { icon: <CurrencyDollar weight="duotone" className="h-6 w-6" />, title: "Captação e Patrocínios", count: 3 },
    ],
  },
  {
    id: "protecao",
    title: "Core de Proteção",
    subtitle: "Suporte jurídico e psicológico para o atleta",
    accent: "chart-5",
    domains: [
      { icon: <Scales weight="duotone" className="h-6 w-6" />, title: "Suporte Jurídico", count: 3 },
      { icon: <HeartHalf weight="duotone" className="h-6 w-6" />, title: "Suporte Psicológico", count: 3 },
    ],
  },
];

function accentClasses(accent: string) {
  const map: Record<string, { bg: string; text: string; border: string; bgLight: string }> = {
    primary: { bg: "bg-primary", text: "text-primary", border: "border-primary/30", bgLight: "bg-primary/10" },
    accent: { bg: "bg-accent", text: "text-accent", border: "border-accent/30", bgLight: "bg-accent/10" },
    "chart-4": { bg: "bg-chart-4", text: "text-chart-4", border: "border-chart-4/30", bgLight: "bg-chart-4/10" },
    "chart-5": { bg: "bg-chart-5", text: "text-chart-5", border: "border-chart-5/30", bgLight: "bg-chart-5/10" },
  };
  return map[accent] ?? map.primary;
}

export default function EcossistemaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav variant="primary" active="ecossistema" />

      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-16 bg-gradient-to-br from-hero-start to-hero-end overflow-hidden">
        <div className="relative z-[1] mx-auto max-w-5xl animate-page-enter">
          <div className="text-center">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl xl:text-6xl">
              Um hub que conecta
              <br />
              <span className="animate-shimmer bg-gradient-to-r from-hero-accent via-white to-hero-accent bg-clip-text text-transparent">
                todo o ecossistema
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-white/65 font-light">
              Atletas, profissionais, metodologia e tecnologia — integrados em
              uma única plataforma para transformar o desenvolvimento esportivo de base.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "4", label: "Pilares" },
              { value: "13", label: "Domínios" },
              { value: "60+", label: "Serviços" },
              { value: "10", label: "Stakeholders" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 py-5 px-4 text-center">
                <p className="text-3xl sm:text-4xl font-black text-white">{s.value}</p>
                <p className="mt-1 text-sm font-medium text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-white/5 blur-[100px]" />
        <div className="absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-[50px] sm:h-[80px] block" preserveAspectRatio="none">
            <path d="M0 80L1440 80L1440 0L0 72Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="py-20 px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              4 pilares, um{" "}
              <span className="text-primary">propósito</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
              A plataforma não substitui o profissional — ela potencializa.
              A metodologia não é genérica — ela se adapta ao atleta.
            </p>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {pillars.map((pillar, i) => (
              <ScrollReveal key={pillar.title} delay={i * 80}>
                <div className="h-full rounded-2xl border bg-card p-7 sm:p-9 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                    {pillar.icon}
                  </div>
                  <h3 className="text-xl font-extrabold">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {pillar.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <ShieldCheck weight="duotone" className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How they connect */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 bg-primary/[0.05]">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Como tudo se{" "}
              <span className="text-primary">conecta</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
              Cada pilar alimenta os outros. A tecnologia não é um fim — é o
              meio que torna as conexões possíveis.
            </p>
          </ScrollReveal>

          <ScrollReveal className="grid gap-5 sm:grid-cols-2 stagger-children">
            {connections.map((conn) => (
              <div
                key={conn.from + conn.to}
                className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {conn.icon}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <span className="text-primary">{conn.from}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-primary">{conn.to}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {conn.description}
                </p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Service layers overview */}
      <section className="py-20 px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              13 domínios em{" "}
              <span className="text-primary">4 camadas</span>{" "}
              de serviço
            </h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-2xl mx-auto">
              Da quadra ao escritório — cada camada cobre uma dimensão
              do desenvolvimento integral do atleta.
            </p>
          </ScrollReveal>

          <div className="space-y-6">
            {serviceLayers.map((layer, layerIndex) => {
              const ac = accentClasses(layer.accent);
              return (
                <ScrollReveal key={layer.id} delay={layerIndex * 60}>
                  <div className={`relative rounded-2xl border ${ac.border} bg-card p-6 sm:p-8 shadow-sm overflow-hidden`}>
                    {/* Accent bar */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${ac.bg} rounded-l-2xl`} />

                    <div className="pl-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                        <div>
                          <h3 className={`text-lg sm:text-xl font-extrabold ${ac.text}`}>
                            {layer.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {layer.subtitle}
                          </p>
                        </div>
                        <span className={`inline-flex self-start items-center rounded-full ${ac.bgLight} ${ac.text} px-3 py-1 text-xs font-bold`}>
                          {layer.domains.length} domínios
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {layer.domains.map((domain) => (
                          <div
                            key={domain.title}
                            className={`flex items-center gap-3 rounded-xl ${ac.bgLight} p-3`}
                          >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-card ${ac.text} shrink-0 shadow-sm`}>
                              {domain.icon}
                            </div>
                            <div>
                              <p className="text-sm font-bold leading-tight">{domain.title}</p>
                              <p className="text-xs text-muted-foreground">{domain.count} serviços</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-4 sm:px-8 lg:px-16 bg-gradient-to-br from-hero-start to-hero-end text-white">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            Faça parte do
            <br />
            ecossistema
          </h2>
          <p className="mt-6 text-lg text-white/70">
            Seja atleta, profissional, clube ou patrocinador — há um lugar
            para você na plataforma.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
            <Link href="/ferramentas">
              <Button
                size="lg"
                className="btn-glow bg-white text-primary font-bold hover:bg-white/90 text-base px-10 h-14 rounded-full shadow-xl shadow-black/25 transition-transform hover:scale-105"
              >
                Ver ferramentas
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white/50 text-white font-bold hover:bg-white/15 hover:border-white/70 text-base px-10 h-14 rounded-full bg-white/10 backdrop-blur-sm"
            >
              Criar conta gratuita
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </div>
  );
}
