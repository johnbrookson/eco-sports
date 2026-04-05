---
name: performance-metrics
description: Use when working on the performance history domain — the `performance-metrics.json` schema, the `/app/performance` dashboard with charts and event creation, the Zod discriminated union for match vs assessment events, or recharts styling with theme tokens. Covers how performance events relate to the athlete physical profile and why they are complementary, not competing.
---

> **Manutenção desta skill**: última revisão refletindo exposição de performance no perfil público (flags `showMatchStats`/`showAssessmentStats`, stat cards com delta + trend badge, revalidação em `addPerformanceEvent`). Se você adicionou um tipo de evento novo (training, video_review, combined), mudou o schema de métricas, ou alterou o gráfico/formulário, atualize esta skill **no mesmo commit** ou commit adjacente. Ver `git log -- .claude/skills/performance-metrics/` para histórico.

# Performance metrics — histórico de eventos do atleta

Contraparte temporal do perfil. Enquanto `athlete.physicalProfile` é o snapshot "hoje o João tem 186cm, 76kg", `performance-metrics` é "nestes 13 eventos ao longo da temporada, aqui está a evolução". Complementares, não concorrentes.

## Imperativo (30 segundos)

- **Leia a skill `conventions` primeiro** se ainda não leu nesta conversa.
- **Cada evento é atômico, não agregado.** Um `PerformanceEvent` = uma partida OU uma avaliação OU um treino. Um atleta tem N desses eventos. **Não** use essa entidade pra armazenar médias — médias são calculadas no render.
- **Escopo v1 cobre apenas `match` e `assessment`.** O schema define 5 tipos (`training`, `match`, `assessment`, `video_review`, `combined`), mas o editor e o dashboard só lidam com 2. Adicionar um tipo novo = novo branch no `CreateEventSchema` (discriminated union) + nova tab no dashboard + nova stat card + novo gráfico + revalidatePath. Não é "só adicionar uma opção no select".
- **Zod discriminated union** é o padrão aqui. O `CreateEventSchema` tem duas variantes (`MatchEventSchema`, `AssessmentEventSchema`) com campos obrigatórios diferentes, discriminadas por `sourceType`. Replicar esse padrão ao adicionar tipos novos.
- **Strokes do gráfico usam CSS custom properties dos tokens de tema** (`var(--color-primary)`, `var(--color-accent)`, `var(--color-chart-3)`). Nunca hardcode cor no gráfico — as cores seguem o tema ativo automaticamente.
- **`durationMinutes` no form é UX**, não vai pro schema. O form captura "duração total" e o action computa `endedAt = startedAt + durationMinutes` pra preencher o `period.endedAt` do schema. Mantenha esse desacoplamento.

## Modelo de dados

### Um evento atômico = um registro

```ts
interface PerformanceEvent {
  id: string;
  tenantId: string;
  athleteId: string;       // many-to-one: 1 atleta, N eventos
  sport: string;           // "basketball" no MVP
  context: {
    sourceType: "match" | "assessment" | "training" | "video_review" | "combined";
    competition?: string;  // match only
    opponent?: string;     // match only
    location?: string;
    notes?: string;
    sessionId?: string;
    matchId?: string;
  };
  period: {
    startedAt: string;     // ISO
    endedAt: string;       // ISO
    season?: string;       // "2025-26"
    cycle?: string;        // "preseason" | "mid" | "late" | "postseason"
  };
  metrics: {
    // Box score (só faz sentido para match):
    minutesPlayed?, points?, assists?, rebounds?, steals?, blocks?,
    turnovers?, fouls?, fieldGoalAttempts?, fieldGoalsMade?,
    threePointAttempts?, threePointsMade?, freeThrowAttempts?,
    freeThrowsMade?, fieldGoalPct?, threePointPct?, freeThrowPct?,

    // Físico (só faz sentido para assessment):
    sprintSpeedMps?, verticalJumpCm?, agilitySeconds?, enduranceScore?,

    // Técnico (faz sentido para training/assessment):
    coachRating?, technicalNotes?, videoTags?,
  };
  benchmarks?: {
    positionAverage?: object;
    teamAverage?: object;
    seasonTrend?: "up" | "down" | "stable" | "unknown";
  };
  attachments?: Array<{
    type: "video" | "image" | "report" | "spreadsheet" | "other";
    url: string;
    label?: string;
  }>;
  createdAt: string;
}
```

Todas as métricas são **opcionais no schema** porque tipos diferentes preenchem campos diferentes. A validação estrita por tipo acontece no Zod (discriminated union) quando o evento é criado via form.

### Por que atômico e não agregado

Cada partida, treino e avaliação é um evento independente. Médias, contagens, gráficos — tudo é computado no render a partir do array filtrado. Vantagens:

- **Granularidade pra drill-down**: da média "14 pts/jogo" pra "aqui está cada jogo que entrou na média"
- **Auditoria trivial**: dá pra revisitar um evento específico, corrigir, revisar
- **Gráficos de linha natural**: cada evento = um ponto no eixo X
- **Sem recomputação de agregados**: adicionar um evento não invalida cálculos pré-gravados

## Arquivos-chave

### Schema e types

- [schemas/performance-metrics.json](../../../schemas/performance-metrics.json) — schema canônico. Amplo o suficiente pra cobrir a v1 sem modificação. Quando tiver que mudar (ex: adicionar campo pra NFL-like stats quando basquete deixar de ser o único esporte), lembre-se de atualizar os types também.
- [web/src/types/performance.ts](../../../web/src/types/performance.ts) — types TS alinhados ao schema. Tem `// fonte:` no topo. Define `PerformanceEvent`, `PerformanceContext`, `PerformancePeriod`, `PerformanceMetricValues`, `PerformanceBenchmarks`, `PerformanceAttachment`, `PerformanceSourceType`, `SeasonTrend`.

### Mocks

- [web/src/lib/mock/performance.ts](../../../web/src/lib/mock/performance.ts) — ~26 eventos hand-crafted cobrindo uma temporada completa (nov/2025–mar/2026). 13 por atleta, misturando match e assessment. **Narrativa embutida**: João assists 5→9, vertical 58→62cm; Mariana rebounds 7→11. Isso foi feito propositalmente pra que o gráfico conte uma história visível mesmo em stub. **Se você regenerar os mocks, mantenha essa propriedade**.
- [web/src/lib/mock/get-performance.ts](../../../web/src/lib/mock/get-performance.ts) — helpers:
  - `getPerformanceEventsForAthlete(athleteId)` — retorna eventos ordenados por `period.startedAt` descending (mais recentes primeiro). Memoizado via `cache()`.
  - `pushPerformanceEvent(event)` — mutação in-place usada pelo Server Action.

### Server Action

- [web/src/lib/performance/actions.ts](../../../web/src/lib/performance/actions.ts) — `addPerformanceEvent`:
  - **Zod `discriminatedUnion`** em `sourceType` com `MatchEventSchema` e `AssessmentEventSchema`. Este é o padrão canônico do projeto pra forms com variantes; replicar ao adicionar tipos novos.
  - Campo `durationMinutes` do form é UX-only — convertido pra `period.endedAt` = `startedAt + durationMinutes` antes de persistir.
  - Autorização via `getCurrentAthlete()` (DAL).
  - `pushPerformanceEvent` + `revalidatePath("/app/performance")`.
  - Retorna `AddEventFormState` com `ok`, `errors`, `message` — consumido via `useActionState`.

### Páginas

- [web/src/app/(app)/app/performance/page.tsx](../../../web/src/app/(app)/app/performance/page.tsx) — Server Component. Fetcha via DAL + `getPerformanceEventsForAthlete`, passa pros componentes client.
- [web/src/app/(app)/app/performance/performance-dashboard.tsx](../../../web/src/app/(app)/app/performance/performance-dashboard.tsx) — Client Component:
  - Tabs `Partidas | Avaliações` com contagem de cada tipo
  - Por tab: 4 stat cards + gráfico de linha recharts + lista cronológica com `EventList` genérico
  - `MatchDashboard` usa médias das últimas 5 partidas
  - `AssessmentDashboard` usa última medição (não média — avaliações são poucas e espaçadas)
  - Gráfico de match tem 3 séries (pontos, assistências, rebotes); gráfico de assessment tem 1 (vertical jump) — intencional, menos linhas fica mais legível
- [web/src/app/(app)/app/performance/add-event-form.tsx](../../../web/src/app/(app)/app/performance/add-event-form.tsx) — Client Component:
  - Toggle `Partida | Avaliação` que renderiza forms diferentes (`MatchForm` vs `AssessmentForm`)
  - Cada variante tem `<input type="hidden" name="sourceType" value="..." />` pra discriminador do Zod
  - `useActionState` conectado ao `addPerformanceEvent`
  - Campos numéricos usam `z.coerce.number()` no Zod pra aceitar string do input HTML

## Padrões estabelecidos

### Chart strokes via CSS custom properties

O recharts aceita strings CSS nos props `stroke`, `fill`, `background`. Usamos isso pra plugar direto nos tokens de tema:

```tsx
<Line
  stroke="var(--color-primary)"
  strokeWidth={2.5}
  dot={{ r: 3 }}
/>
```

Vantagens sobre hardcodar hex:
- Troca de tema (basketball ↔ indigo) atualiza as cores do gráfico sem código condicional
- Light/dark mode também atualiza (se a definição do token mudar entre modos)
- Consistência visual com o resto da página

**Anti-pattern:** `stroke="#ff6600"`. Sempre token.

As 3 cores usadas no gráfico de match foram escolhidas propositalmente do chart palette que já existe no design system: `--color-primary` (cor principal do tema, pros pontos), `--color-accent` (cor secundária, pras assistências), `--color-chart-3` (verde no basketball, pros rebotes).

### Discriminated union no Zod 4

```ts
const MatchEventSchema = z.object({
  sourceType: z.literal("match"),
  startedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
  durationMinutes: z.coerce.number().min(1).max(180),
  // ... campos obrigatórios de match
});

const AssessmentEventSchema = z.object({
  sourceType: z.literal("assessment"),
  startedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/),
  durationMinutes: z.coerce.number().min(1).max(300),
  // ... campos obrigatórios de assessment
});

const CreateEventSchema = z.discriminatedUnion("sourceType", [
  MatchEventSchema,
  AssessmentEventSchema,
]);

// depois do safeParse:
const parsed = CreateEventSchema.safeParse(raw);
if (parsed.success) {
  if (parsed.data.sourceType === "match") {
    // TypeScript sabe que aqui parsed.data é MatchEventSchema
    console.log(parsed.data.points);  // OK
  } else {
    // parsed.data.sourceType === "assessment"
    console.log(parsed.data.verticalJumpCm);  // OK
  }
}
```

Quando for adicionar um terceiro tipo (ex: `training`), adicione:
1. Novo schema `TrainingEventSchema` com `z.literal("training")` + campos específicos (ex: `durationMinutes`, `rpe`, `drillsCompleted`, etc)
2. Adicione ao array do `discriminatedUnion`
3. Adicione o branch correspondente no switch dentro do `addPerformanceEvent` que monta o `PerformanceEvent` final
4. Nova tab no dashboard com componente `TrainingDashboard` análogo aos existentes
5. Nova opção no toggle do `add-event-form.tsx` com `<input type="hidden" name="sourceType" value="training" />`
6. Atualize esta skill listando o novo tipo como suportado

### Médias vs últimas — quando usar qual

- **Match**: usar médias das últimas N (5 tipicamente) — faz sentido porque jogos acontecem com frequência semanal, dá pra ter uma estatística confiável
- **Assessment**: usar valor mais recente, não média — avaliações acontecem a cada 1-2 meses, média dilui a tendência recente
- **Training** (futuro): provavelmente média das últimas 4-6 semanas ou alguma janela temporal
- **Video review** (futuro): contagem total + tags mais frequentes, provavelmente

### Duração total vs minutos jogados

Dois campos distintos no form de match:
- `durationMinutes` — duração **total do jogo**, incluindo intervalos. UX-only, usado pra calcular `period.endedAt`. Default 100min.
- `minutesPlayed` — minutos **jogados pelo atleta**. Vai pro `metrics.minutesPlayed`. Default vazio.

**Anti-pattern**: reusar `durationMinutes` pra `minutesPlayed`. São conceitos diferentes — titular joga 30min, reserva joga 8min, mas ambos jogos duraram 100min.

## Anti-patterns específicos do domínio

- **Não agregue métricas no schema** (ex: um `seasonAverages` field). Agregados são calculados no render.
- **Não use `z.any()` ou `z.object({}).passthrough()`** pra aceitar "todas as métricas". Use a discriminated union e seja estrito.
- **Não hardcode cor no gráfico**. Sempre `var(--color-*)`.
- **Não misture match e assessment na mesma tab**. Cada tipo tem stat cards e gráficos próprios — juntar fica noisy.
- **Não implemente "editar evento"** sem pensar no fluxo completo (versionamento? audit log? soft delete? quem pode editar — atleta ou só coach?). É escopo futuro.
- **Não adicione benchmarks (posição/time) sem dados reais**. O schema tem o campo, mas calcular isso no stub é inventar números — fica confuso e diminui a confiança no dashboard.
- **Não coloque lógica de cálculo no client se ela já tem que rodar no server** (ex: médias). O render client já faz isso.

## Exposição no perfil público (implementado)

Implementado em 2026-04-05. Atletas expõem performance no perfil público `/atleta/[slug]` controlado por duas flags granulares em `athlete.visibility`, defaults `false`:

- `showMatchStats` — stat cards de partidas (médias das últimas 5) com delta vs partidas anteriores
- `showAssessmentStats` — stat cards de avaliações físicas (última medição) com delta vs penúltima

Flags **independentes** porque atendem públicos diferentes: um sub-17 pode querer expor avaliações físicas pra scout mas não estatísticas de jogo (que variam demais com minutagem e adversário). Mesmo princípio que levou a separar `publicProfileEnabled` de `discoverable`.

**LGPD — proteção provisória**: para menores, a proteção hoje é só copy de aviso no editor (mesmo padrão de `discoverable`). Na fase `parent_guardian`, essas flags entram na lista que exige aprovação do responsável quando `minorConsentProvided === true`.

**Sem recharts no perfil público.** O perfil público é Server Component zero-JS no core. Evolução comunicada em duas camadas (formato A + C do planejamento; formato B — sparkline SVG inline — descartado pro v1):

- **Delta nos stat cards**: `12,4 pts/jogo · ↑ 2,1 · últimas 5`. Match: avg(últimas 5) vs avg(anteriores). Assessment: última vs penúltima medição. Se dados insuficientes (< 2 partidas anteriores ou < 2 avaliações), delta omitido.
- **Badge narrativo de tendência**: `Em evolução · pontos e assistências em alta, rebotes estáveis`. Classificação por limiar de 5%: |delta/baseline| > 5% → em alta/queda, senão → estável. Maioria up → "Em evolução" (verde), maioria down → "Em queda" (vermelho), misto → "Desempenho estável" (muted). Dados insuficientes → contagem simples ("8 partidas · 5 avaliações na temporada").

**Trend computado no render**, não lido de campo mockado. O anti-pattern "não inventar benchmarks nos mocks" continua valendo — a evolução é computada inline no Server Component de `/atleta/[slug]/page.tsx` a partir do array de eventos.

### Arquivos envolvidos

- [schemas/athlete.json](../../../schemas/athlete.json) — flags `showMatchStats`, `showAssessmentStats` em `visibility`
- [web/src/types/athlete.ts](../../../web/src/types/athlete.ts) — adicionadas ao `AthleteVisibility`
- [web/src/app/(profile)/atleta/[slug]/page.tsx](../../../web/src/app/(profile)/atleta/[slug]/page.tsx) — `PerformanceSection`, `PerfStatsGrid`, `PerfStatCard`, `perfTrendDetail`, `formatNum`. Busca eventos via `getPerformanceEventsForAthlete` existente (sem helper novo — simplificado vs plano original).
- [web/src/lib/profile/actions.ts](../../../web/src/lib/profile/actions.ts) — Zod + `toBool` para as novas flags no `saveProfile`
- [web/src/app/(app)/app/perfil/profile-form.tsx](../../../web/src/app/(app)/app/perfil/profile-form.tsx) — `InlineToggle` na seção "Privacidade granular"
- [web/src/lib/performance/actions.ts](../../../web/src/lib/performance/actions.ts) — `addPerformanceEvent` agora revalida `/atleta/<slug>` quando pelo menos uma flag está ligada
- [web/src/lib/mock/athletes.ts](../../../web/src/lib/mock/athletes.ts) — João false/false (menor, conservador), Mariana true/true (maior, aberta)

### Desvios do plano original

- **Sem helper `getPublicPerformanceForAthlete`**: o `getPerformanceEventsForAthlete` existente (já memoizado via `cache()`) é chamado direto pelo page component. Filtro por flags acontece no JSX (mesmo padrão das outras flags de visibility).
- **`saveProfile` já revalida `/atleta/<slug>`**: não precisou de mudança adicional — o `revalidatePath` existente já cobre.
- **Janela de delta**: "últimas 5 vs anteriores" (todas antes das últimas 5), não "primeiras 5". Mais robusto quando o atleta tem > 10 partidas.

Ver skill `athlete-profile` pro contexto do modelo de visibility e as outras flags granulares.

## Próximos candidatos de evolução

Quando vier a próxima expansão, estas são as direções prováveis (em ordem de valor provável):

1. **Editar/remover evento** — atualmente só adicionar
2. **Filtros por período** (última semana, último mês, toda temporada)
3. **Comparar temporadas** — duas linhas no mesmo gráfico, uma pra cada season
4. **Tipo `training`** com rpe, drills, observações do coach
5. **Benchmarks reais** — cálculo da média da posição dentro do tenant + linha de referência no gráfico
6. **Anexos** — upload de vídeo/relatório vinculado ao evento

## Para profundidade, ler

- [schemas/performance-metrics.json](../../../schemas/performance-metrics.json) — fonte canônica
- [docs/saas-plano-inicial.md](../../../docs/saas-plano-inicial.md) — seção "SaaS autenticado" > `/app/performance`
- Skill `athlete-profile` — para entender como performance complementa o perfil (não substitui)
- Skill `design-system` — para tokens usados nos gráficos
- [Recharts docs](https://recharts.org/en-US/api) (externo) — quando precisar de um chart type novo ou customização além do que já fizemos
