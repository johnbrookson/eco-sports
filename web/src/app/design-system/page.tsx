import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  BarChart3,
  Check,
  Loader2,
  Plus,
  Target,
  Video,
} from "lucide-react";

export const metadata = {
  title: "Design System — Eco-Sports",
};

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-8 py-8 lg:px-16">
          <h1 className="text-3xl font-black tracking-tight">
            Eco-Sports <span className="text-primary">Design System</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tokens, tipografia, componentes e padrões visuais da plataforma.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-8 py-12 lg:px-16 space-y-20">
        {/* ============ CORES ============ */}
        <section>
          <SectionTitle
            title="Cores"
            description="Paleta semântica com light e dark mode. Todas definidas em oklch."
          />

          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Core
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                <ColorSwatch
                  name="Primary"
                  className="bg-primary text-primary-foreground"
                  token="--primary"
                />
                <ColorSwatch
                  name="Secondary"
                  className="bg-secondary text-secondary-foreground"
                  token="--secondary"
                />
                <ColorSwatch
                  name="Accent"
                  className="bg-accent text-accent-foreground"
                  token="--accent"
                />
                <ColorSwatch
                  name="Destructive"
                  className="bg-destructive text-white"
                  token="--destructive"
                />
                <ColorSwatch
                  name="Muted"
                  className="bg-muted text-muted-foreground"
                  token="--muted"
                />
                <ColorSwatch
                  name="Background"
                  className="bg-background text-foreground border"
                  token="--background"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Superfícies
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                <ColorSwatch
                  name="Card"
                  className="bg-card text-card-foreground border"
                  token="--card"
                />
                <ColorSwatch
                  name="Popover"
                  className="bg-popover text-popover-foreground border"
                  token="--popover"
                />
                <ColorSwatch
                  name="Border"
                  className="bg-border text-foreground"
                  token="--border"
                />
                <ColorSwatch
                  name="Input"
                  className="bg-input text-foreground"
                  token="--input"
                />
                <ColorSwatch
                  name="Ring"
                  className="bg-ring text-white"
                  token="--ring"
                />
                <ColorSwatch
                  name="Foreground"
                  className="bg-foreground text-background"
                  token="--foreground"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Charts
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                <ColorSwatch
                  name="Chart 1"
                  className="bg-chart-1 text-white"
                  token="--chart-1"
                />
                <ColorSwatch
                  name="Chart 2"
                  className="bg-chart-2 text-white"
                  token="--chart-2"
                />
                <ColorSwatch
                  name="Chart 3"
                  className="bg-chart-3 text-white"
                  token="--chart-3"
                />
                <ColorSwatch
                  name="Chart 4"
                  className="bg-chart-4 text-white"
                  token="--chart-4"
                />
                <ColorSwatch
                  name="Chart 5"
                  className="bg-chart-5 text-white"
                  token="--chart-5"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Hero Gradient
              </h4>
              <div className="h-24 rounded-2xl bg-gradient-to-br from-hero-start to-hero-end flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  from-hero-start → to-hero-end
                </span>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ============ TIPOGRAFIA ============ */}
        <section>
          <SectionTitle
            title="Tipografia"
            description="Inter como fonte base. Escala tipográfica com pesos e tamanhos definidos."
          />

          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-baseline justify-between border-b pb-4">
                <span className="text-6xl font-black tracking-tight">
                  Display
                </span>
                <code className="text-xs text-muted-foreground">
                  text-6xl / font-black
                </code>
              </div>
              <div className="flex items-baseline justify-between border-b pb-4">
                <span className="text-5xl font-extrabold tracking-tight">
                  Heading 1
                </span>
                <code className="text-xs text-muted-foreground">
                  text-5xl / font-extrabold
                </code>
              </div>
              <div className="flex items-baseline justify-between border-b pb-4">
                <span className="text-4xl font-bold tracking-tight">
                  Heading 2
                </span>
                <code className="text-xs text-muted-foreground">
                  text-4xl / font-bold
                </code>
              </div>
              <div className="flex items-baseline justify-between border-b pb-4">
                <span className="text-3xl font-bold tracking-tight">
                  Heading 3
                </span>
                <code className="text-xs text-muted-foreground">
                  text-3xl / font-bold
                </code>
              </div>
              <div className="flex items-baseline justify-between border-b pb-4">
                <span className="text-xl font-semibold">Heading 4</span>
                <code className="text-xs text-muted-foreground">
                  text-xl / font-semibold
                </code>
              </div>
              <div className="flex items-baseline justify-between border-b pb-4">
                <span className="text-lg leading-relaxed">
                  Body Large — Gestão de carreira e desenvolvimento de atletas.
                </span>
                <code className="text-xs text-muted-foreground">
                  text-lg / leading-relaxed
                </code>
              </div>
              <div className="flex items-baseline justify-between border-b pb-4">
                <span className="text-base leading-relaxed">
                  Body — Gestão de carreira e desenvolvimento de atletas.
                </span>
                <code className="text-xs text-muted-foreground">
                  text-base
                </code>
              </div>
              <div className="flex items-baseline justify-between border-b pb-4">
                <span className="text-sm text-muted-foreground">
                  Caption — Informações complementares e metadados.
                </span>
                <code className="text-xs text-muted-foreground">
                  text-sm / text-muted-foreground
                </code>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                  Overline — Rótulos e categorias
                </span>
                <code className="text-xs text-muted-foreground">
                  text-xs / uppercase / tracking-wider / font-bold
                </code>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ============ BUTTONS ============ */}
        <section>
          <SectionTitle
            title="Buttons"
            description="Variantes, tamanhos e estados."
          />

          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Variantes
              </h4>
              <div className="flex flex-wrap gap-4 items-center">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Tamanhos
              </h4>
              <div className="flex flex-wrap gap-4 items-center">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Com ícone + pill
              </h4>
              <div className="flex flex-wrap gap-4 items-center">
                <Button className="rounded-full px-8">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="rounded-full px-8">
                  Conhecer a plataforma
                </Button>
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* ============ INPUTS ============ */}
        <section>
          <SectionTitle
            title="Inputs"
            description="Campos de formulário e áreas de texto."
          />

          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome completo</label>
              <Input placeholder="Ex: Lucas Ferreira" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="atleta@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Desabilitado</label>
              <Input disabled placeholder="Campo desabilitado" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Posição</label>
              <Input placeholder="Ex: Atacante" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea
                placeholder="Escreva observações sobre o atleta..."
                rows={3}
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* ============ BADGES ============ */}
        <section>
          <SectionTitle title="Badges" description="Indicadores e rótulos." />

          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Check className="mr-1 h-3 w-3" /> Ativo
            </Badge>
            <Badge className="bg-amber-400 text-amber-950 hover:bg-amber-500">
              Em análise
            </Badge>
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90">
              Vídeo novo
            </Badge>
          </div>
        </section>

        <Separator />

        {/* ============ AVATARS ============ */}
        <section>
          <SectionTitle
            title="Avatars"
            description="Representação visual de usuários."
          />

          <div className="flex flex-wrap gap-6 items-end">
            <div className="text-center space-y-2">
              <Avatar className="h-8 w-8 mx-auto">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  LF
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">SM</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar className="h-10 w-10 mx-auto">
                <AvatarFallback className="bg-accent text-accent-foreground">
                  MR
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">MD</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar className="h-14 w-14 mx-auto">
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  CS
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">LG</p>
            </div>
            <div className="text-center space-y-2">
              <Avatar className="h-20 w-20 mx-auto">
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  AB
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground">XL</p>
            </div>
          </div>
        </section>

        <Separator />

        {/* ============ CARDS ============ */}
        <section>
          <SectionTitle
            title="Cards"
            description="Containers para agrupar conteúdo relacionado."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle>Análise de Desempenho</CardTitle>
                <CardDescription>
                  Métricas centralizadas com dashboards inteligentes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                  <Target className="h-6 w-6" />
                </div>
                <CardTitle>Gestão de Carreira</CardTitle>
                <CardDescription>
                  Planejamento de metas e oportunidades.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                  <Video className="h-6 w-6" />
                </div>
                <CardTitle>Análise de Vídeo</CardTitle>
                <CardDescription>
                  Upload e anotação de vídeos para evolução.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Card com conteúdo</CardTitle>
                <CardDescription>
                  Exemplo de card com header, conteúdo e dados tabulares.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Atleta</TableHead>
                      <TableHead>Posição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Lucas Ferreira
                      </TableCell>
                      <TableCell>Atacante</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Sub-20</Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        9.2
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Maria Santos
                      </TableCell>
                      <TableCell>Meio-campo</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Sub-17</Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        8.7
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Carlos Silva
                      </TableCell>
                      <TableCell>Goleiro</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Profissional</Badge>
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        8.9
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* ============ TABS ============ */}
        <section>
          <SectionTitle
            title="Tabs"
            description="Navegação por abas para organizar conteúdo."
          />

          <Tabs defaultValue="overview" className="max-w-2xl">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
              <TabsTrigger value="videos">Vídeos</TabsTrigger>
              <TabsTrigger value="career">Carreira</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visão Geral do Atleta</CardTitle>
                  <CardDescription>
                    Resumo das informações principais, métricas recentes e
                    status da carreira.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="stats" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                  <CardDescription>
                    Métricas detalhadas de desempenho em treinos e jogos.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="videos" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Vídeo</CardTitle>
                  <CardDescription>
                    Clipes, anotações e análises técnicas.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
            <TabsContent value="career" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Carreira</CardTitle>
                  <CardDescription>
                    Histórico de clubes, contratos e transições.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <Separator />

        {/* ============ SPACING & RADIUS ============ */}
        <section>
          <SectionTitle
            title="Espaçamento & Radius"
            description="Escala de border-radius utilizada nos componentes."
          />

          <div className="flex flex-wrap gap-6 items-end">
            {(
              [
                ["sm", "radius-sm"],
                ["md", "radius-md"],
                ["lg", "radius-lg"],
                ["xl", "radius-xl"],
                ["2xl", "radius-2xl"],
                ["3xl", "radius-3xl"],
                ["full", "rounded-full"],
              ] as const
            ).map(([label, token]) => (
              <div key={label} className="text-center space-y-2">
                <div
                  className={`h-16 w-16 bg-primary ${
                    label === "full" ? "rounded-full" : `rounded-${label}`
                  }`}
                />
                <p className="text-xs text-muted-foreground font-medium">
                  {label}
                </p>
                <p className="text-[10px] text-muted-foreground">{token}</p>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ============ TOKENS REFERENCE ============ */}
        <section>
          <SectionTitle
            title="Referência de Tokens"
            description="Variáveis CSS utilizadas no design system. Dois temas disponíveis: Indigo e Basketball."
          />

          <Tabs defaultValue="indigo" className="w-full">
            <TabsList>
              <TabsTrigger value="indigo">Tema Indigo</TabsTrigger>
              <TabsTrigger value="basketball">Tema Basketball</TabsTrigger>
            </TabsList>
            <TabsContent value="indigo" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Uso</TableHead>
                        <TableHead>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tokenReferenceIndigo.map((t) => (
                        <TableRow key={t.token}>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {t.token}
                            </code>
                          </TableCell>
                          <TableCell className="text-sm">{t.usage}</TableCell>
                          <TableCell>
                            <code className="text-xs">{t.value}</code>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="basketball" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Uso</TableHead>
                        <TableHead>Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tokenReferenceBasketball.map((t) => (
                        <TableRow key={t.token}>
                          <TableCell>
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {t.token}
                            </code>
                          </TableCell>
                          <TableCell className="text-sm">{t.usage}</TableCell>
                          <TableCell>
                            <code className="text-xs">{t.value}</code>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 px-8 lg:px-16 mt-12">
        <div className="mx-auto max-w-7xl text-center text-sm text-muted-foreground">
          Eco-Sports Design System · Ceronify · {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-muted-foreground">{description}</p>
    </div>
  );
}

function ColorSwatch({
  name,
  className,
  token,
}: {
  name: string;
  className: string;
  token: string;
}) {
  return (
    <div className="space-y-2">
      <div
        className={`h-20 rounded-xl flex items-end p-3 ${className}`}
      >
        <span className="text-xs font-bold">{name}</span>
      </div>
      <code className="text-[10px] text-muted-foreground block">{token}</code>
    </div>
  );
}

const tokenBase = [
  { token: "--primary", usage: "Ações principais, CTAs, links ativos" },
  { token: "--accent", usage: "Destaques, badges, informações complementares" },
  { token: "--secondary", usage: "Botões secundários, backgrounds alternativos" },
  { token: "--muted", usage: "Backgrounds sutis, seções alternadas" },
  { token: "--destructive", usage: "Ações destrutivas, erros, alertas críticos" },
  { token: "--background", usage: "Fundo geral da aplicação" },
  { token: "--foreground", usage: "Texto principal" },
  { token: "--border", usage: "Bordas de cards, inputs, separadores" },
  { token: "--ring", usage: "Focus ring de inputs e botões" },
  { token: "--radius", usage: "Border-radius base" },
  { token: "--hero-start", usage: "Gradiente do hero — cor inicial" },
  { token: "--hero-end", usage: "Gradiente do hero — cor final" },
  { token: "--hero-accent", usage: "Texto destacado sobre o hero" },
];

const indigoValues: Record<string, string> = {
  "--primary": "oklch(0.50 0.24 270) — indigo",
  "--accent": "oklch(0.60 0.22 290) — violet",
  "--secondary": "oklch(0.96 0.008 270)",
  "--muted": "oklch(0.96 0.005 270)",
  "--destructive": "oklch(0.577 0.245 27)",
  "--background": "oklch(0.99 0.002 270)",
  "--foreground": "oklch(0.17 0.02 270) — dark navy",
  "--border": "oklch(0.91 0.01 270)",
  "--ring": "oklch(0.50 0.24 270)",
  "--radius": "0.625rem",
  "--hero-start": "oklch(0.42 0.20 265) — indigo médio",
  "--hero-end": "oklch(0.55 0.24 262) — indigo claro",
  "--hero-accent": "oklch(0.75 0.20 270) — indigo claro vibrante",
};

const basketballValues: Record<string, string> = {
  "--primary": "oklch(0.65 0.22 45) — laranja vibrante",
  "--accent": "oklch(0.50 0.18 255) — azul NBA",
  "--secondary": "oklch(0.96 0.008 70)",
  "--muted": "oklch(0.96 0.005 70)",
  "--destructive": "oklch(0.577 0.245 27)",
  "--background": "oklch(0.99 0.005 70)",
  "--foreground": "oklch(0.15 0.02 250) — dark navy",
  "--border": "oklch(0.91 0.01 70)",
  "--ring": "oklch(0.65 0.22 45)",
  "--radius": "0.625rem",
  "--hero-start": "oklch(0.60 0.20 45) — laranja",
  "--hero-end": "oklch(0.20 0.04 250) — navy escuro",
  "--hero-accent": "oklch(0.78 0.18 45) — laranja claro",
};

const tokenReferenceIndigo = tokenBase.map((t) => ({
  ...t,
  value: indigoValues[t.token] ?? "",
}));

const tokenReferenceBasketball = tokenBase.map((t) => ({
  ...t,
  value: basketballValues[t.token] ?? "",
}));
