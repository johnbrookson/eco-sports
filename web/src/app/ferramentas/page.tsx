import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { ScrollLink } from "@/components/scroll-link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  ArrowLeft,
  ArrowRight,
  ChartBar,
  Target,
  VideoCamera,
  Briefcase,
  Scales,
  CurrencyDollar,
  Barbell,
  HeartHalf,
  ChatCircleDots,
  TrendUp,
  ClipboardText,
  Play,
  ShieldCheck,
  UsersThree,
  FileText,
  CalendarDots,
  Trophy,
  BookOpen,
  Storefront,
  Star,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";

const tools = [
  {
    id: "analise-desempenho",
    icon: <ChartBar weight="duotone" className="h-7 w-7" />,
    title: "Análise de Desempenho",
    subtitle: "Dados que impulsionam a evolução",
    description:
      "Centralize métricas de treinos, jogos e avaliações em dashboards inteligentes. Compare períodos, identifique padrões e tome decisões baseadas em dados reais sobre a evolução do atleta.",
    features: [
      {
        icon: <TrendUp weight="duotone"className="h-5 w-5" />,
        label: "Dashboards em tempo real",
        detail:
          "Visualize pontos, assistências, rebotes e métricas customizadas com gráficos interativos.",
      },
      {
        icon: <ClipboardText weight="duotone"className="h-5 w-5" />,
        label: "Benchmarking por posição",
        detail:
          "Compare o desempenho com atletas da mesma posição e categoria para entender onde evoluir.",
      },
      {
        icon: <Target weight="duotone"className="h-5 w-5" />,
        label: "Alertas de evolução e regressão",
        detail:
          "Receba notificações automáticas quando métricas indicarem melhora significativa ou queda.",
      },
      {
        icon: <FileText weight="duotone"className="h-5 w-5" />,
        label: "Relatórios técnicos",
        detail:
          "Gere relatórios em PDF ou link privado para compartilhar com treinadores, clubes e scouts.",
      },
    ],
  },
  {
    id: "gestao-carreira",
    icon: <Target weight="duotone"className="h-7 w-7" />,
    title: "Gestão de Carreira",
    subtitle: "Planejamento estratégico da trajetória",
    description:
      "Do início na base até a profissionalização, planeje cada etapa da carreira com metas por temporada, milestones de desenvolvimento e acompanhamento contínuo de progresso.",
    features: [
      {
        icon: <ClipboardText weight="duotone"className="h-5 w-5" />,
        label: "Avaliação inicial completa",
        detail:
          "Análise de perfil com habilidades técnicas, físicas e comportamentais para definir o ponto de partida.",
      },
      {
        icon: <CalendarDots weight="duotone"className="h-5 w-5" />,
        label: "Metas por temporada",
        detail:
          "Defina objetivos técnicos, de exposição e extracurriculares com cronograma e revisões periódicas.",
      },
      {
        icon: <Trophy weight="duotone"className="h-5 w-5" />,
        label: "Milestones e transições",
        detail:
          "Acompanhe marcos da carreira e prepare transições entre categorias com mentoria especializada.",
      },
      {
        icon: <UsersThree weight="duotone"className="h-5 w-5" />,
        label: "Assessoria a pais e responsáveis",
        detail:
          "Workshops, consultorias individuais e comunidade de suporte para famílias de atletas.",
      },
    ],
  },
  {
    id: "analise-video",
    icon: <VideoCamera weight="duotone"className="h-7 w-7" />,
    title: "Análise de Vídeo",
    subtitle: "Evolução visual e tática",
    description:
      "Faça upload de vídeos de jogos e treinos, crie clipes com anotações técnicas e gere highlights automáticos. Ferramenta essencial para feedback visual e divulgação para scouts.",
    features: [
      {
        icon: <Play weight="duotone"className="h-5 w-5" />,
        label: "Upload e organização",
        detail:
          "Envie vídeos de jogos e treinos organizados por data, evento e contexto de origem.",
      },
      {
        icon: <ClipboardText weight="duotone"className="h-5 w-5" />,
        label: "Tagueamento de eventos",
        detail:
          "Marque lances, jogadas e situações táticas diretamente no vídeo com tags categorizadas.",
      },
      {
        icon: <Trophy weight="duotone"className="h-5 w-5" />,
        label: "Geração de highlights",
        detail:
          "Compile os melhores momentos automaticamente para criar reels de divulgação.",
      },
      {
        icon: <FileText weight="duotone"className="h-5 w-5" />,
        label: "Anotações e feedback visual",
        detail:
          "Adicione comentários técnicos e táticos quadro a quadro para revisão com treinadores.",
      },
    ],
  },
  {
    id: "portfolio",
    icon: <Briefcase weight="duotone"className="h-7 w-7" />,
    title: "Portfólio Profissional",
    subtitle: "Sua vitrine para o mundo esportivo",
    description:
      "Crie um perfil público profissional com estatísticas, highlights, histórico e conquistas. Compartilhe com scouts, clubes e patrocinadores com um único link.",
    features: [
      {
        icon: <UsersThree weight="duotone"className="h-5 w-5" />,
        label: "Página pública do atleta",
        detail:
          "Perfil compartilhável com dados, vídeos e estatísticas atualizadas automaticamente.",
      },
      {
        icon: <FileText weight="duotone"className="h-5 w-5" />,
        label: "Media kit e apresentações",
        detail:
          "Material profissional pronto para envio a scouts, clubes e potenciais patrocinadores.",
      },
      {
        icon: <Trophy weight="duotone"className="h-5 w-5" />,
        label: "Conquistas e histórico",
        detail:
          "Timeline visual com títulos, prêmios individuais e marcos da carreira.",
      },
      {
        icon: <TrendUp weight="duotone"className="h-5 w-5" />,
        label: "Estatísticas em destaque",
        detail:
          "Números-chave apresentados de forma visual e comparativa para impressionar recrutadores.",
      },
    ],
  },
  {
    id: "juridico",
    icon: <Scales weight="duotone"className="h-7 w-7" />,
    title: "Suporte Jurídico",
    subtitle: "Proteção e conformidade",
    description:
      "Repositório centralizado de contratos, gestão de direitos de imagem, calendário de vencimentos e conformidade com LGPD. Proteja a carreira do atleta desde a base.",
    features: [
      {
        icon: <FileText weight="duotone"className="h-5 w-5" />,
        label: "Repositório de contratos",
        detail:
          "Templates, revisão assistida, histórico de negociações e versionamento de documentos.",
      },
      {
        icon: <ShieldCheck weight="duotone"className="h-5 w-5" />,
        label: "Direitos de imagem",
        detail:
          "Gestão completa de uso de imagem com monitoramento e estratégias de posicionamento.",
      },
      {
        icon: <CalendarDots weight="duotone"className="h-5 w-5" />,
        label: "Calendário de vencimentos",
        detail:
          "Alertas automáticos para renovações, prazos contratuais e datas críticas.",
      },
      {
        icon: <ClipboardText weight="duotone"className="h-5 w-5" />,
        label: "Consentimentos e LGPD",
        detail:
          "Gestão de consentimentos versionados com checklist de conformidade legal.",
      },
    ],
  },
  {
    id: "patrocinios",
    icon: <CurrencyDollar weight="duotone"className="h-7 w-7" />,
    title: "Patrocínios e Captação",
    subtitle: "Recursos para crescer",
    description:
      "Conecte-se com patrocinadores, gerencie o pipeline comercial, elabore projetos de Lei de Incentivo ao Esporte e acompanhe o ROI de cada parceria.",
    features: [
      {
        icon: <UsersThree weight="duotone"className="h-5 w-5" />,
        label: "CRM de patrocinadores",
        detail:
          "Base de prospects, histórico de contatos e pipeline de negociação organizado.",
      },
      {
        icon: <FileText weight="duotone"className="h-5 w-5" />,
        label: "Lei de Incentivo ao Esporte",
        detail:
          "Elaboração de projetos, captação de empresas e gestão dos recursos aprovados.",
      },
      {
        icon: <TrendUp weight="duotone"className="h-5 w-5" />,
        label: "Relatórios de ROI",
        detail:
          "Demonstre o retorno das parcerias com dados de visibilidade, engajamento e impacto.",
      },
      {
        icon: <Trophy weight="duotone"className="h-5 w-5" />,
        label: "Projetos sociais",
        detail:
          "Programas esportivos comunitários, parcerias com ONGs e campanhas de captação.",
      },
    ],
  },
  {
    id: "treinamento",
    icon: <Barbell weight="duotone"className="h-7 w-7" />,
    title: "Programas de Treinamento",
    subtitle: "Evolução técnica e física",
    description:
      "Planos individualizados para desenvolvimento técnico e físico, com calendário de sessões, gestão de carga e acompanhamento de microciclos e macrociclos.",
    features: [
      {
        icon: <ClipboardText weight="duotone"className="h-5 w-5" />,
        label: "Planos personalizados",
        detail:
          "Programas técnicos e físicos adaptados ao nível, posição e objetivos do atleta.",
      },
      {
        icon: <CalendarDots weight="duotone"className="h-5 w-5" />,
        label: "Calendário de treinos",
        detail:
          "Agenda integrada com sessões individuais, coletivas e avaliações periódicas.",
      },
      {
        icon: <TrendUp weight="duotone"className="h-5 w-5" />,
        label: "Gestão de carga",
        detail:
          "Monitoramento de volume e intensidade para prevenir lesões e otimizar resultados.",
      },
      {
        icon: <Target weight="duotone"className="h-5 w-5" />,
        label: "Ciclos de evolução",
        detail:
          "Estruturação em microciclos e macrociclos com metas progressivas.",
      },
    ],
  },
  {
    id: "bem-estar",
    icon: <HeartHalf weight="duotone"className="h-7 w-7" />,
    title: "Bem-estar e Educação",
    subtitle: "Desenvolvimento integral",
    description:
      "Suporte psicológico, planejamento financeiro e acadêmico para garantir que o atleta se desenvolva dentro e fora da quadra. Porque uma carreira sólida vai além do esporte.",
    features: [
      {
        icon: <HeartHalf weight="duotone"className="h-5 w-5" />,
        label: "Suporte psicológico",
        detail:
          "Preparação mental, gestão de pressão competitiva e desenvolvimento de foco e resiliência.",
      },
      {
        icon: <CurrencyDollar weight="duotone"className="h-5 w-5" />,
        label: "Planejamento financeiro",
        detail:
          "Educação financeira, gestão de receitas esportivas e planejamento de investimentos.",
      },
      {
        icon: <BookOpen weight="duotone"className="h-5 w-5" />,
        label: "Educação acadêmica",
        detail:
          "Conciliação estudo-esporte, planejamento educacional e preparação para pós-carreira.",
      },
      {
        icon: <UsersThree weight="duotone"className="h-5 w-5" />,
        label: "Suporte familiar",
        detail:
          "Conteúdo educacional, workshops e materiais de apoio para famílias de atletas.",
      },
    ],
  },
  {
    id: "comunicacao",
    icon: <ChatCircleDots weight="duotone"className="h-7 w-7" />,
    title: "Comunicação e CRM",
    subtitle: "Conexões que fazem a diferença",
    description:
      "Centralize a comunicação entre atletas, treinadores, clubes e patrocinadores. Gerencie agenda, notificações e relacionamento com a imprensa em um só lugar.",
    features: [
      {
        icon: <ChatCircleDots weight="duotone"className="h-5 w-5" />,
        label: "Comunicação integrada",
        detail:
          "Mensagens entre stakeholders com histórico, anexos e contexto da conversa.",
      },
      {
        icon: <CalendarDots weight="duotone"className="h-5 w-5" />,
        label: "Gestão de agenda",
        detail:
          "Disponibilidade por tipo — presencial, remoto, avaliação — com agendamento integrado.",
      },
      {
        icon: <FileText weight="duotone"className="h-5 w-5" />,
        label: "Assessoria de imprensa",
        detail:
          "Produção de releases, gestão de entrevistas e relacionamento com mídia.",
      },
      {
        icon: <TrendUp weight="duotone"className="h-5 w-5" />,
        label: "Campanhas e engajamento",
        detail:
          "Gestão de campanhas para patrocinadores e análise de engajamento nas ações.",
      },
    ],
  },
  {
    id: "marketplace",
    icon: <Storefront weight="duotone"className="h-7 w-7" />,
    title: "Marketplace de Profissionais",
    subtitle: "O ecossistema esportivo ao seu alcance",
    description:
      "Encontre e agende serviços de profissionais especializados no esporte: treinadores, preparadores físicos, nutricionistas, psicólogos, fisioterapeutas, advogados desportivos, videomakers e mais — tudo dentro da plataforma.",
    features: [
      {
        icon: <MagnifyingGlass weight="duotone"className="h-5 w-5" />,
        label: "Catálogo e matching inteligente",
        detail:
          "Descubra profissionais por especialidade, modalidade, localização e necessidades do atleta com recomendações personalizadas.",
      },
      {
        icon: <CalendarDots weight="duotone"className="h-5 w-5" />,
        label: "Agendamento integrado",
        detail:
          "Agende sessões presenciais, remotas, avaliações únicas ou acompanhamento contínuo direto pelo perfil do profissional.",
      },
      {
        icon: <Star weight="duotone"className="h-5 w-5" />,
        label: "Avaliações e reputação",
        detail:
          "Sistema de avaliações por atletas e famílias para construir confiança e destacar os melhores profissionais.",
      },
      {
        icon: <CurrencyDollar weight="duotone"className="h-5 w-5" />,
        label: "Pagamento e pacotes",
        detail:
          "Sessões avulsas, pacotes ou planos recorrentes com pagamento integrado e split automático de receita.",
      },
    ],
  },
];

export default function FerramentasPage() {
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
            href="/atletas"
            className="hover:text-primary-foreground transition-colors"
          >
            Atletas
          </Link>
          <Link
            href="/ferramentas"
            className="text-primary-foreground font-semibold"
          >
            Ferramentas
          </Link>
          <Link href="/blog" className="hover:text-primary-foreground transition-colors">
            Blog
          </Link>
          <Link href="/ecossistema" className="hover:text-primary-foreground transition-colors">
            Ecossistema
          </Link>
          <Link href="/para-quem" className="hover:text-primary-foreground transition-colors">
            Para quem
          </Link>
          <Link href="/#pricing" className="hover:text-primary-foreground transition-colors">
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
      <section className="relative py-20 px-8 lg:px-16 bg-gradient-to-br from-hero-start to-hero-end overflow-hidden">
        <div className="relative z-[1] mx-auto max-w-5xl text-center animate-page-enter">
          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl xl:text-6xl">
            Ferramentas{" "}
            <span className="animate-shimmer bg-gradient-to-r from-hero-accent via-white to-hero-accent bg-clip-text text-transparent">
              Integradas
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed text-white/65 font-light">
            Conheça em detalhes cada ferramenta da plataforma Eco-Sports.
            Tudo pensado para o desenvolvimento completo do atleta — da
            performance à carreira.
          </p>
        </div>
        <div className="absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -left-20 bottom-0 h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px]" />

        {/* Diagonal cut */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-[50px] sm:h-[80px] block"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80L1440 80L1440 0L0 72Z"
              className="fill-background"
            />
          </svg>
        </div>
      </section>

      {/* Quick nav — sticky sub-nav */}
      <nav className="sticky top-[69px] z-10 py-3 px-4 sm:px-8 border-b border-primary/15 bg-primary/[0.12] backdrop-blur-lg shadow-sm">
        <div className="flex flex-wrap justify-center gap-1.5 px-1">
          {tools.map((tool, index) => (
            <span key={tool.id} className="flex items-center gap-1.5">
              {index > 0 && (
                <span className="hidden sm:block h-4 w-px bg-border/60 mx-0.5" />
              )}
              <ScrollLink
                targetId={tool.id}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all whitespace-nowrap"
              >
                {tool.icon}
                <span className="hidden sm:inline">{tool.title}</span>
              </ScrollLink>
            </span>
          ))}
        </div>
      </nav>

      {/* Tool sections */}
      {tools.map((tool, index) => (
        <section
          key={tool.id}
          id={tool.id}
          className={`py-24 px-8 lg:px-16 scroll-mt-36 ${
            index % 2 === 1 ? "bg-primary/[0.10]" : "bg-primary/[0.05]"
          }`}
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
              {/* Left — info */}
              <ScrollReveal className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {tool.icon}
                </div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {tool.subtitle}
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {tool.title}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
              </ScrollReveal>

              {/* Right — feature cards */}
              <ScrollReveal
                delay={150}
                className={`grid gap-5 sm:grid-cols-2 stagger-children ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                {tool.features.map((feature) => (
                  <div
                    key={feature.label}
                    className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-base font-bold">{feature.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.detail}
                    </p>
                  </div>
                ))}
              </ScrollReveal>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-28 px-8 lg:px-16 bg-gradient-to-br from-hero-start to-hero-end text-white">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl leading-tight">
            Pronto para usar todas
            <br />
            essas ferramentas?
          </h2>
          <p className="mt-6 text-lg text-white/70">
            Comece gratuitamente e tenha acesso a toda a plataforma Eco-Sports.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
            <Button
              size="lg"
              className="btn-glow bg-white text-primary font-bold hover:bg-white/90 text-base px-10 h-14 rounded-full shadow-xl shadow-black/25 transition-transform hover:scale-105"
            >
              Criar conta gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/50 text-white font-bold hover:bg-white/15 hover:border-white/70 text-base px-10 h-14 rounded-full bg-white/10 backdrop-blur-sm"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar ao início
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <SiteFooter />
    </div>
  );
}
