import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollLink } from "@/components/scroll-link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  ArrowRight,
  Basketball,
  Binoculars,
  Briefcase,
  Buildings,
  ChartBar,
  CurrencyDollar,
  GraduationCap,
  Handshake,
  HeartHalf,
  Path,
  Scales,
  ShieldCheck,
  Stethoscope,
  Student,
  Target,
  Users,
  UsersThree,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

/* ─── Stakeholders data ─── */

interface Stakeholder {
  id: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  description: string;
  painQuote?: string;
  painPoints: string[];
  platformValue: string[];
  accent: "primary" | "accent" | "chart-4" | "chart-5";
}

const stakeholders: Stakeholder[] = [
  {
    id: "atleta",
    icon: <Basketball weight="duotone" className="h-7 w-7" />,
    title: "Atletas de Base",
    subtitle: "O centro de tudo",
    description:
      "Jovens a partir de 11 anos que sonham em se tornar atletas profissionais. Da escolinha ao clube, cada fase exige visibilidade, dados e orientação que a maioria não tem acesso.",
    painQuote:
      "Eu sei que tenho talento, mas não sei como mostrar isso para quem importa.",
    painPoints: [
      "Não sabe quando e onde acontecem seletivas",
      "Sem portfólio estruturado para mostrar seu valor",
      "Avaliação subjetiva — talento sem números é invisível",
      "Sem planejamento de carreira nem visão de longo prazo",
      "Pressão emocional sem acompanhamento profissional",
    ],
    platformValue: [
      "Portfólio digital com métricas, highlights e histórico",
      "Calendário de seletivas e alertas por categoria e região",
      "Dashboards de performance com benchmarking por posição",
      "Gestão de carreira com metas por temporada",
      "Acesso a profissionais especializados via marketplace",
    ],
    accent: "primary",
  },
  {
    id: "pais",
    icon: <Users weight="duotone" className="h-7 w-7" />,
    title: "Pais e Responsáveis",
    subtitle: "A base de apoio",
    description:
      "Investem tempo, dinheiro e energia emocional na formação do filho. Precisam de transparência sobre a evolução, segurança jurídica e orientação para tomar decisões informadas.",
    painQuote:
      "Quero apoiar meu filho, mas não sei se estou tomando as decisões certas.",
    painPoints: [
      "Falta de visibilidade sobre a real evolução do atleta",
      "Dificuldade em avaliar a qualidade de profissionais e clubes",
      "Insegurança jurídica em contratos e acordos",
      "Custos acumulados sem clareza de retorno",
      "Pressão emocional compartilhada sem suporte",
    ],
    platformValue: [
      "Dashboard de acompanhamento da evolução do filho",
      "Profissionais avaliados e verificados no marketplace",
      "Suporte jurídico para revisão de contratos",
      "Planejamento financeiro e captação via Lei de Incentivo",
      "Conteúdo educativo sobre formação esportiva",
    ],
    accent: "primary",
  },
  {
    id: "treinadores",
    icon: <Target weight="duotone" className="h-7 w-7" />,
    title: "Treinadores e Preparadores",
    subtitle: "Quem forma o atleta",
    description:
      "Profissionais que dedicam a carreira ao desenvolvimento de jovens atletas. Precisam de ferramentas para registrar evolução, planejar treinos e comunicar progresso de forma estruturada.",
    painQuote:
      "Sei o potencial de cada atleta, mas não tenho como provar isso com dados.",
    painPoints: [
      "Avaliação feita no olho — sem dados estruturados",
      "Dificuldade em comunicar evolução para pais e clubes",
      "Sem ferramentas integradas de planejamento de treino",
      "Visibilidade limitada do próprio trabalho",
      "Falta de conexão com outros profissionais do ecossistema",
    ],
    platformValue: [
      "Dashboards de performance dos atletas sob sua gestão",
      "Ferramentas de planejamento de microciclos e macrociclos",
      "Relatórios automáticos para pais e diretoria",
      "Perfil profissional com portfólio e avaliações",
      "Rede de profissionais complementares no marketplace",
    ],
    accent: "accent",
  },
  {
    id: "clubes",
    icon: <Buildings weight="duotone" className="h-7 w-7" />,
    title: "Clubes e Academias",
    subtitle: "A estrutura formadora",
    description:
      "Organizações que investem na formação de base e precisam de gestão eficiente de elencos, métricas de desenvolvimento e processos de captação estruturados.",
    painQuote:
      "Temos dezenas de atletas, mas não conseguimos acompanhar a evolução de cada um com a profundidade necessária.",
    painPoints: [
      "Gestão de elenco em planilhas e papel",
      "Sem métricas padronizadas entre categorias",
      "Processos de seletiva desorganizados",
      "Dificuldade em reter talentos por falta de estrutura visível",
      "Comunicação fragmentada com pais e profissionais",
    ],
    platformValue: [
      "Gestão centralizada de elencos e categorias",
      "Métricas padronizadas e comparáveis entre atletas",
      "Seletivas digitais com avaliação estruturada",
      "Vitrine institucional para atrair talentos e patrocínio",
      "CRM integrado para comunicação com stakeholders",
    ],
    accent: "accent",
  },
  {
    id: "scouts",
    icon: <Binoculars weight="duotone" className="h-7 w-7" />,
    title: "Scouts e Recrutadores",
    subtitle: "O olho do mercado",
    description:
      "Profissionais que buscam talentos para clubes profissionais. Precisam de acesso a dados confiáveis, highlights em vídeo e filtros avançados para encontrar o atleta certo.",
    painQuote:
      "Para cada talento que descubro, quantos passam despercebidos porque eu não estava naquele jogo?",
    painPoints: [
      "Dependência de presença física em jogos e seletivas",
      "Sem base de dados unificada de atletas de base",
      "Avaliação limitada a poucos minutos de observação",
      "Dificuldade em acompanhar evolução ao longo do tempo",
      "Rede de contatos informal e fragmentada",
    ],
    platformValue: [
      "Base de atletas com filtros por posição, categoria e região",
      "Portfólios com highlights e estatísticas verificadas",
      "Acompanhamento longitudinal da evolução do atleta",
      "Alertas automáticos para atletas que atingem benchmarks",
      "Canal direto com atletas, famílias e clubes formadores",
    ],
    accent: "chart-4",
  },
  {
    id: "patrocinadores",
    icon: <CurrencyDollar weight="duotone" className="h-7 w-7" />,
    title: "Patrocinadores",
    subtitle: "Quem investe no futuro",
    description:
      "Empresas e pessoas físicas que querem investir no esporte de base com impacto real, visibilidade e retorno — seja via patrocínio direto ou Lei de Incentivo ao Esporte.",
    painQuote:
      "Quero apoiar o esporte de base, mas não sei onde meu investimento vai gerar mais impacto.",
    painPoints: [
      "Falta de visibilidade sobre onde o recurso é aplicado",
      "Dificuldade em encontrar projetos confiáveis",
      "Sem métricas de impacto do investimento",
      "Processos burocráticos de Lei de Incentivo",
      "Baixo retorno de marca e engajamento",
    ],
    platformValue: [
      "Projetos verificados com relatórios de impacto",
      "Dashboard de acompanhamento do investimento",
      "Suporte completo para Lei de Incentivo ao Esporte",
      "Visibilidade de marca no ecossistema esportivo",
      "Conexão direta com atletas e histórias de superação",
    ],
    accent: "chart-4",
  },
  {
    id: "profissionais",
    icon: <Stethoscope weight="duotone" className="h-7 w-7" />,
    title: "Profissionais do Marketplace",
    subtitle: "Especialistas conectados",
    description:
      "Nutricionistas, preparadores físicos, videomakers, analistas e outros especialistas que atendem atletas de base e buscam visibilidade, agenda e pagamento integrados.",
    painPoints: [
      "Dificuldade em encontrar atletas que precisam do serviço",
      "Sem plataforma para divulgar trabalho e receber avaliações",
      "Agendamento e pagamento manuais",
      "Acesso limitado a dados do atleta para personalizar atendimento",
    ],
    platformValue: [
      "Perfil profissional com portfólio e avaliações",
      "Matching inteligente com atletas por necessidade",
      "Agendamento e pagamento integrados na plataforma",
      "Acesso aos dados do atleta para atendimento personalizado",
    ],
    accent: "chart-5",
  },
  {
    id: "psicologos",
    icon: <HeartHalf weight="duotone" className="h-7 w-7" />,
    title: "Psicólogos Esportivos",
    subtitle: "Suporte emocional estruturado",
    description:
      "Profissionais essenciais para a saúde mental de atletas jovens que enfrentam pressão por performance, ansiedade de seletiva e competição interna diariamente.",
    painPoints: [
      "Atletas só buscam ajuda em crise, não preventivamente",
      "Sem integração com dados de performance do atleta",
      "Estigma cultural sobre acompanhamento psicológico no esporte",
      "Dificuldade em escalar atendimento para equipes inteiras",
    ],
    platformValue: [
      "Canal de atendimento integrado ao perfil do atleta",
      "Correlação entre métricas de performance e bem-estar",
      "Conteúdo educativo para normalizar o cuidado mental",
      "Programas de atendimento por equipe e categoria",
    ],
    accent: "chart-5",
  },
  {
    id: "advogados",
    icon: <Scales weight="duotone" className="h-7 w-7" />,
    title: "Advogados Esportivos",
    subtitle: "Proteção jurídica desde a base",
    description:
      "Especialistas em direito esportivo que protegem atletas jovens e suas famílias em contratos, transferências e questões regulatórias — um mercado carente de profissionais acessíveis.",
    painPoints: [
      "Famílias assinam contratos sem orientação jurídica",
      "Regulamentação de atletas menores é complexa e pouco conhecida",
      "Falta de demanda organizada para escalar o atendimento",
      "Sem acesso a dados contratuais e histórico do atleta",
    ],
    platformValue: [
      "Revisão de contratos integrada ao fluxo de carreira",
      "Base de conhecimento sobre direitos do atleta de base",
      "Demanda recorrente via marketplace da plataforma",
      "Acesso ao histórico contratual e documental do atleta",
    ],
    accent: "chart-5",
  },
  {
    id: "gestores",
    icon: <Handshake weight="duotone" className="h-7 w-7" />,
    title: "Gestores de Projetos Sociais",
    subtitle: "Impacto na comunidade",
    description:
      "Coordenam escolinhas, projetos de inclusão e programas comunitários que são a porta de entrada de milhares de jovens no esporte. Precisam de gestão, visibilidade e captação.",
    painPoints: [
      "Gestão de alunos e turmas em papel ou planilhas",
      "Dificuldade em comprovar impacto para patrocinadores",
      "Sem conexão com clubes para encaminhar talentos",
      "Captação de recursos dependente de editais sazonais",
    ],
    platformValue: [
      "Gestão digital de alunos, turmas e frequência",
      "Relatórios de impacto automáticos para prestação de contas",
      "Canal de conexão com clubes e scouts para encaminhamento",
      "Suporte para captação via Lei de Incentivo e patrocínio",
    ],
    accent: "chart-5",
  },
];

/* ─── Accent color helper ─── */

function accentClasses(accent: string) {
  const map: Record<
    string,
    { bg: string; text: string; border: string; bgLight: string }
  > = {
    primary: {
      bg: "bg-primary",
      text: "text-primary",
      border: "border-primary/30",
      bgLight: "bg-primary/10",
    },
    accent: {
      bg: "bg-accent",
      text: "text-accent",
      border: "border-accent/30",
      bgLight: "bg-accent/10",
    },
    "chart-4": {
      bg: "bg-chart-4",
      text: "text-chart-4",
      border: "border-chart-4/30",
      bgLight: "bg-chart-4/10",
    },
    "chart-5": {
      bg: "bg-chart-5",
      text: "text-chart-5",
      border: "border-chart-5/30",
      bgLight: "bg-chart-5/10",
    },
  };
  return map[accent] ?? map.primary;
}

/* ─── Page ─── */

export const metadata = {
  title: "Para Quem — Eco-Sports",
  description:
    "Conheça os stakeholders do ecossistema Eco-Sports: atletas, pais, treinadores, clubes, scouts, patrocinadores e profissionais.",
};

export default function ParaQuemPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-4 sm:py-5 lg:px-16 bg-primary/[0.85] backdrop-blur-lg border-b border-primary/90">
        <Link
          href="/"
          className="text-2xl font-black tracking-tight text-primary-foreground"
        >
          Eco-Sports
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-primary-foreground/70">
          <Link
            href="/ferramentas"
            className="hover:text-primary-foreground transition-colors"
          >
            Ferramentas
          </Link>
          <Link
            href="/blog"
            className="hover:text-primary-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/ecossistema"
            className="hover:text-primary-foreground transition-colors"
          >
            Ecossistema
          </Link>
          <Link
            href="/para-quem"
            className="text-primary-foreground font-semibold"
          >
            Para quem
          </Link>
          <Link
            href="/#pricing"
            className="hover:text-primary-foreground transition-colors"
          >
            Planos
          </Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeSwitcher variant="inline" />
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10 font-medium text-xs sm:text-sm"
          >
            Entrar
          </Button>
          <Button
            size="sm"
            className="hidden sm:inline-flex bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90 rounded-full px-4 sm:px-6 text-xs sm:text-sm"
          >
            Cadastrar
          </Button>
          <MobileNav />
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-8 lg:px-16 bg-gradient-to-br from-hero-start to-hero-end overflow-hidden">
        <div className="relative z-[1] mx-auto max-w-5xl animate-page-enter">
          <div className="text-center">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl xl:text-6xl">
              Feito para quem
              <br />
              <span className="animate-shimmer bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
                vive o esporte
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-white/65 font-light">
              Cada stakeholder do ecossistema esportivo tem dores reais.
              A plataforma foi desenhada para resolver cada uma delas.
            </p>
          </div>

        </div>
        <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-white/5 blur-[100px]" />
        <div className="absolute -bottom-px left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[50px] sm:h-[80px] block"
            preserveAspectRatio="none"
          >
            <path d="M0 80L1440 80L1440 0L0 72Z" className="fill-background" />
          </svg>
        </div>
      </section>

      {/* Quick nav — sticky sub-nav */}
      <nav className="sticky top-[69px] z-10 py-3 px-4 sm:px-8 border-b border-primary/15 bg-primary/[0.12] backdrop-blur-lg shadow-sm">
        <div className="flex flex-wrap justify-center gap-1.5 px-1">
          {stakeholders.map((s, index) => (
            <span key={s.id} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="hidden sm:block h-4 w-px bg-border/60 mx-0.5" />
              )}
              <ScrollLink
                targetId={s.id}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all whitespace-nowrap"
              >
                {s.icon}
                <span className="hidden sm:inline">{s.title}</span>
              </ScrollLink>
            </span>
          ))}
        </div>
      </nav>

      {/* Stakeholder cards */}
      <section className="py-20 px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-12">
          {stakeholders.map((s, i) => {
            const ac = accentClasses(s.accent);
            return (
              <ScrollReveal key={s.id} delay={i * 40}>
                <div
                  id={s.id}
                  className={`relative scroll-mt-36 rounded-2xl border ${ac.border} bg-card shadow-sm overflow-hidden`}
                >
                  {/* Accent bar */}
                  <div
                    className={`absolute top-0 left-0 w-1.5 h-full ${ac.bg} rounded-l-2xl`}
                  />

                  <div className="p-6 sm:p-8 pl-8 sm:pl-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${ac.bgLight} ${ac.text} shrink-0`}
                      >
                        {s.icon}
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                          {s.title}
                        </h2>
                        <p className={`text-sm font-medium ${ac.text}`}>
                          {s.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {s.description}
                    </p>

                    {/* Pain quote */}
                    {s.painQuote && (
                      <blockquote
                        className={`mb-8 border-l-2 ${ac.border} pl-4 py-1 italic text-muted-foreground text-sm`}
                      >
                        &ldquo;{s.painQuote}&rdquo;
                      </blockquote>
                    )}

                    {/* Two columns: pains + platform value */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                          Dores
                        </h3>
                        <ul className="space-y-2">
                          {s.painPoints.map((p) => (
                            <li
                              key={p}
                              className="flex items-start gap-2.5 text-sm text-muted-foreground"
                            >
                              <span className="text-destructive mt-0.5 shrink-0">
                                &times;
                              </span>
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                          Como a plataforma resolve
                        </h3>
                        <ul className="space-y-2">
                          {s.platformValue.map((v) => (
                            <li
                              key={v}
                              className="flex items-start gap-2.5 text-sm text-muted-foreground"
                            >
                              <ShieldCheck
                                weight="duotone"
                                className={`h-4 w-4 ${ac.text} shrink-0 mt-0.5`}
                              />
                              {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-4 sm:px-8 lg:px-16 bg-gradient-to-br from-hero-start to-hero-end text-white">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            Encontrou seu perfil?
          </h2>
          <p className="mt-6 text-lg text-white/70">
            Seja atleta, pai, treinador ou patrocinador — a plataforma foi
            construída para você.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
            <Button
              size="lg"
              className="btn-glow bg-white text-primary font-bold hover:bg-white/90 text-base px-10 h-14 rounded-full shadow-xl shadow-black/25 transition-transform hover:scale-105"
            >
              Criar conta gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/ecossistema">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/50 text-white font-bold hover:bg-white/15 hover:border-white/70 text-base px-10 h-14 rounded-full bg-white/10 backdrop-blur-sm"
              >
                Ver o ecossistema
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </div>
  );
}
