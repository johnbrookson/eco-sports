import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteNav } from "@/components/site-nav";
import { AutoCarousel } from "@/components/auto-carousel";
import { SiteFooter } from "@/components/site-footer";
import {
  ArrowRight,
  Basketball,
  Binoculars,
  Buildings,
  ChartBar,
  Target,
  VideoCamera,
  Briefcase,
  Scales,
  CurrencyDollar,
  Handshake,
  HeartHalf,
  Stethoscope,
  TrendUp,
  Users,
  Play,
} from "@phosphor-icons/react/dist/ssr";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav variant="hero" />

      {/* Hero */}
      <section className="relative flex items-center min-h-[60vh] bg-gradient-to-br from-hero-start to-hero-end overflow-hidden">
        <div className="relative z-[1] mx-auto w-full max-w-[1400px] px-8 lg:px-20">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center min-h-[60vh] pt-24 pb-16">
            {/* Left — text */}
            <div>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl xl:text-6xl">
                A plataforma
                <br />
                completa para atletas
                <br />
                <span className="animate-shimmer bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
                  de categorias de base.
                </span>
              </h1>
              <p className="mt-8 max-w-lg text-xl leading-relaxed text-white/65 font-light">
                Gestão de carreira, análise de desempenho, portfólio
                profissional e captação de recursos — tudo em um só lugar.
              </p>
              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="btn-glow bg-white text-primary font-bold hover:bg-white/90 text-base px-10 h-14 rounded-full shadow-xl shadow-black/25 transition-transform hover:scale-105"
                >
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/50 text-white font-bold hover:bg-white/15 hover:border-white/70 text-base px-10 h-14 rounded-full bg-white/10 backdrop-blur-sm"
                >
                  Conhecer a plataforma
                </Button>
              </div>
            </div>

            {/* Right — floating cards composition */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-full h-[600px]">
                {/* Main dashboard card — tilted */}
                <div className="absolute top-6 left-4 w-80 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-black/10 p-7 z-[3] animate-float-slow">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ChartBar weight="duotone" className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Performance
                        </p>
                        <p className="text-xs text-gray-400">Última semana</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-xs font-bold bg-primary/10 px-2.5 py-1 rounded-full">
                      <TrendUp weight="duotone" className="h-3 w-3" />
                      +12.5%
                    </div>
                  </div>
                  <div className="flex gap-1.5 items-end h-24">
                    {[35, 55, 40, 70, 50, 85, 65, 90, 60, 75, 95, 80].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-md bg-gradient-to-t from-primary/80 to-primary/30"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                  <div className="mt-5 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-gray-900">
                      87.3
                    </span>
                    <span className="text-sm text-gray-400 font-medium">
                      / 100
                    </span>
                  </div>
                </div>

                {/* Athlete profile card — tilted opposite */}
                <div className="absolute top-0 right-0 w-64 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-black/10 p-6 z-[4] animate-float-medium">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-4 ring-2 ring-primary/10" />
                  <p className="text-center text-base font-bold text-gray-900">
                    Lucas Ferreira
                  </p>
                  <p className="text-center text-sm text-gray-400 font-medium">
                    Armador · Sub-16
                  </p>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50/80 rounded-xl py-3">
                      <p className="text-lg font-black text-gray-900">24</p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Points
                      </p>
                    </div>
                    <div className="bg-gray-50/80 rounded-xl py-3">
                      <p className="text-lg font-black text-gray-900">18</p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        Assists
                      </p>
                    </div>
                    <div className="bg-primary/8 rounded-xl py-3">
                      <p className="text-lg font-black text-primary">9.2</p>
                      <p className="text-[11px] text-primary/60 font-medium">
                        Rating
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video analysis card */}
                <div className="absolute bottom-12 left-8 w-72 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-black/10 p-6 z-[5] animate-float-fast">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-11 w-11 rounded-xl bg-accent/10 flex items-center justify-center">
                      <VideoCamera weight="duotone" className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Análise de Vídeo
                      </p>
                      <p className="text-xs text-gray-400">3 novos clipes</p>
                    </div>
                  </div>
                  <div className="h-28 rounded-2xl bg-gray-50/60 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent" />
                    <div className="h-12 w-12 rounded-full bg-white/90 shadow-md flex items-center justify-center z-[1]">
                      <Play weight="duotone" className="h-5 w-5 text-accent ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Floating notification badges */}
                <div className="absolute bottom-4 right-4 rounded-2xl bg-primary text-white px-5 py-3 text-sm font-bold shadow-xl shadow-primary/30 z-[6] animate-pulse-badge">
                  Scout interessado
                </div>

                <div className="absolute top-[45%] right-16 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/40 text-gray-900 px-4 py-2.5 text-xs font-bold shadow-xl shadow-black/10 z-[6] animate-pulse-badge-alt">
                  <span className="text-amber-500 mr-1">●</span> Top 5 do mês
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full border-2 border-white/[0.06]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[420px] rounded-full border-2 border-white/[0.03]" />
              </div>
            </div>
          </div>
        </div>

        {/* Background glows */}
        <div className="absolute right-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[150px]" />
        <div className="absolute -left-20 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[100px]" />

        {/* Diagonal cut */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[80px] sm:h-[120px] block"
            preserveAspectRatio="none"
          >
            <path
              d="M0 120L1440 120L1440 0L0 108Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28 px-8 lg:px-16 bg-primary/[0.06]">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-5xl">
              Tudo que o atleta precisa
              <br />
              <span className="text-primary">para evoluir</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-center text-muted-foreground text-lg">
              Ferramentas integradas para cada etapa da carreira esportiva.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100} className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border bg-card p-8 shadow-md transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
                <Link
                  href={`/ferramentas#${f.anchor}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline transition-colors"
                >
                  Saiba mais…
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Audience */}
      <section id="audience" className="py-16 sm:py-28 bg-muted/50">
        <div className="mx-auto max-w-7xl px-8 lg:px-16">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-extrabold tracking-tight sm:text-5xl">
              Para quem é o{" "}
              <span className="text-primary">Eco-Sports</span>?
            </h2>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={100}>
          <AutoCarousel
            interval={3000}
            className="mt-10 sm:mt-20 flex lg:justify-center gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          >
            <div className="shrink-0 w-3 lg:hidden" aria-hidden="true" />
            {audiences.map((a) => (
              <div
                key={a.label}
                data-carousel-item
                className="flex flex-col items-center rounded-2xl border bg-card p-8 text-center shadow-md transition-all hover:shadow-xl hover:-translate-y-1 snap-start shrink-0 w-64 sm:w-56"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {a.iconEl}
                </div>
                <h3 className="mt-4 text-base font-bold">{a.label}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {a.desc}
                </p>
              </div>
            ))}
          </AutoCarousel>
        </ScrollReveal>
      </section>

      {/* Vitrine — teaser para o diretório público de atletas */}
      <section className="py-20 sm:py-28 px-8 lg:px-16 bg-background">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="rounded-3xl border border-border bg-card overflow-hidden">
              <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
                <div className="p-10 sm:p-14 flex flex-col justify-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary mb-3">
                    Vitrine pública
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                    Descubra atletas
                    <br />
                    de categorias de base.
                  </h2>
                  <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-md">
                    Perfis públicos com bio, ficha física, highlights e
                    conquistas. Apenas atletas que optaram por aparecer na
                    busca pública — o resto permanece acessível só por
                    link direto.
                  </p>
                  <div className="mt-8">
                    <Link
                      href="/atletas"
                      className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 h-12 text-sm font-bold hover:bg-primary/90 transition-colors"
                    >
                      Explorar vitrine
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div
                  className="relative min-h-[240px] md:min-h-0 bg-[#0b0f1a]"
                  aria-hidden
                >
                  <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0, rgba(255,255,255,0.35) 1px, transparent 1px, transparent 14px)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center p-10">
                    <p className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter uppercase text-white/90 leading-[0.85] text-center">
                      Atletas
                      <br />
                      <span className="text-primary">em ação</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-8 lg:px-16 bg-gradient-to-br from-hero-start to-hero-end text-white">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            Pronto para transformar
            <br />
            sua carreira esportiva?
          </h2>
          <p className="mt-6 text-lg text-white/70">
            Junte-se a atletas, treinadores e clubes que já estão usando a
            plataforma.
          </p>
          <Button
            size="lg"
            className="mt-10 btn-glow bg-white text-primary font-bold hover:bg-white/90 text-base px-10 h-14 rounded-full shadow-xl shadow-black/25 transition-transform hover:scale-105"
          >
            Criar conta gratuita
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </div>
  );
}

const features = [
  {
    icon: <ChartBar weight="duotone"className="h-6 w-6" />,
    title: "Análise de Desempenho",
    description:
      "Métricas de treino, jogo e avaliação centralizadas com dashboards inteligentes.",
    anchor: "analise-desempenho",
  },
  {
    icon: <Target weight="duotone"className="h-6 w-6" />,
    title: "Gestão de Carreira",
    description:
      "Planejamento de metas, transições e oportunidades ao longo de toda a trajetória.",
    anchor: "gestao-carreira",
  },
  {
    icon: <VideoCamera weight="duotone"className="h-6 w-6" />,
    title: "Análise de Vídeo",
    description:
      "Upload, recorte e anotação de vídeos para evolução técnica e tática.",
    anchor: "analise-video",
  },
  {
    icon: <Briefcase weight="duotone"className="h-6 w-6" />,
    title: "Portfólio Profissional",
    description:
      "Perfil público compartilhável com highlights, estatísticas e histórico.",
    anchor: "portfolio",
  },
  {
    icon: <Scales weight="duotone"className="h-6 w-6" />,
    title: "Suporte Jurídico",
    description:
      "Revisão de contratos, gestão de consentimentos e conformidade com LGPD.",
    anchor: "juridico",
  },
  {
    icon: <CurrencyDollar weight="duotone"className="h-6 w-6" />,
    title: "Patrocínios e Captação",
    description:
      "Conexão com patrocinadores, Lei de Incentivo ao Esporte e projetos de captação.",
    anchor: "patrocinios",
  },
];

const audiences = [
  {
    iconEl: <Basketball weight="duotone" className="h-7 w-7" />,
    label: "Atletas de Base",
    desc: "Visibilidade, portfólio digital e gestão de carreira desde a formação.",
  },
  {
    iconEl: <Users weight="duotone" className="h-7 w-7" />,
    label: "Pais e Responsáveis",
    desc: "Transparência sobre a evolução, segurança jurídica e orientação.",
  },
  {
    iconEl: <Target weight="duotone" className="h-7 w-7" />,
    label: "Treinadores",
    desc: "Planejamento de treinos, métricas e acompanhamento de atletas.",
  },
  {
    iconEl: <Buildings weight="duotone" className="h-7 w-7" />,
    label: "Clubes e Academias",
    desc: "Gestão de elenco, seletivas estruturadas e desenvolvimento de talentos.",
  },
  {
    iconEl: <Binoculars weight="duotone" className="h-7 w-7" />,
    label: "Scouts",
    desc: "Base de atletas com filtros, highlights e estatísticas verificadas.",
  },
  {
    iconEl: <CurrencyDollar weight="duotone" className="h-7 w-7" />,
    label: "Patrocinadores",
    desc: "Investimento com impacto real, visibilidade e relatórios de retorno.",
  },
  {
    iconEl: <Stethoscope weight="duotone" className="h-7 w-7" />,
    label: "Profissionais",
    desc: "Marketplace com perfil, agendamento e pagamento integrados.",
  },
  {
    iconEl: <HeartHalf weight="duotone" className="h-7 w-7" />,
    label: "Psicólogos Esportivos",
    desc: "Suporte emocional integrado ao perfil e dados de performance.",
  },
  {
    iconEl: <Scales weight="duotone" className="h-7 w-7" />,
    label: "Advogados Esportivos",
    desc: "Revisão de contratos e proteção jurídica para atletas de base.",
  },
  {
    iconEl: <Handshake weight="duotone" className="h-7 w-7" />,
    label: "Projetos Sociais",
    desc: "Gestão digital, relatórios de impacto e captação de recursos.",
  },
];
