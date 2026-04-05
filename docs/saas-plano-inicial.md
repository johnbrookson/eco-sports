# Plano Inicial do SaaS — Eco-Sports

Este documento registra as decisões arquiteturais iniciais para a construção da aplicação SaaS (área autenticada) dentro do projeto `web/`. É um **plano**, não uma implementação — nenhum código foi escrito com base nele ainda. Serve como contrato com sessões futuras de desenvolvimento.

> Status: **planejado, não implementado**. Ver "Próximos passos" ao final.

---

## Contexto

Até o momento, `web/` contém apenas a **landing page pública** do Eco-Sports (rotas `/`, `/para-quem`, `/ferramentas`, `/ecossistema`, `/blog`, `/design-system`). O próximo passo é construir o **SaaS** — a área autenticada onde os atores definidos em [actors-permissoes.md](actors-permissoes.md) vão operar a plataforma.

Estamos em fase de **design pré-backend**: não há API, banco ou serviço de auth real. As decisões abaixo priorizam permitir que as telas sejam construídas e evoluídas com a menor quantidade de retrabalho possível quando o backend chegar.

---

## Decisões

### 1. Localização do SaaS — Route Groups no mesmo projeto

O SaaS vive dentro de `web/` usando a convenção de **route groups** do Next.js 16:

```
web/src/app/
├── (marketing)/       # público — landing, para-quem, ferramentas, etc.
│   ├── layout.tsx     # layout público (nav atual, footer institucional)
│   └── page.tsx       # landing em /
├── (app)/             # SaaS autenticado — /app/*
│   ├── layout.tsx     # layout autenticado (sidebar, topbar, persona switcher)
│   └── app/
│       ├── page.tsx   # dashboard
│       └── ...
├── (auth)/            # telas de auth — /login, /signup, /forgot-password
│   ├── layout.tsx     # layout minimalista centrado
│   └── login/page.tsx
├── (profile)/         # perfis públicos do atleta — /atleta/[slug]
│   ├── layout.tsx     # layout minimalista (sem nav de marketing nem SaaS)
│   └── atleta/[slug]/
│       ├── page.tsx           # perfil público
│       └── not-found.tsx      # 404 customizado no mesmo estilo
└── layout.tsx         # root layout (html/body, fonte, data-theme)
```

**Por quê:** zero infra nova, um único deploy, compartilha design system e componentes. Quando fizer sentido extrair o SaaS para `app.eco-sports.com`, a migração é mecânica (mover a pasta `(app)` pra um projeto separado). Alternativas descartadas: subdomínio dedicado (infra extra desnecessária no MVP) e monorepo com dois projetos (over-engineering).

**Considerações do Next.js 16:**
- Route groups `(nome)` continuam funcionando e não aparecem na URL.
- Cada root layout separado causa full page reload na navegação entre grupos — aceitável entre marketing e SaaS (o usuário só faz essa transição em login/logout).
- `params` e `searchParams` agora são `Promise<...>` e precisam de `await`.
- Existem helpers globais de tipos: `PageProps<'/rota'>` e `LayoutProps<'/rota'>`, gerados por `next typegen`.

**Sobre o grupo `(profile)` (adicionado depois do plano original):** o perfil público do atleta não cabe em `(marketing)` (não deve herdar a nav/footer institucional) nem em `(app)` (é público, sem auth, sem chrome de SaaS). É um ativo de marketing pessoal — portfólio/press-kit — consumido por scouts, olheiros, patrocinadores, mídia. Merece layout próprio com visual editorial/sport-magazine e é um canal de aquisição orgânica (cada atleta que compartilha o link divulga a plataforma). Decisão detalhada na conversa de 2026-04-05.

### 2. Autenticação — Server Actions stub, formato agnóstico compatível com OIDC

Não integraremos nenhum provider de auth nesta fase. Em vez disso:

- Criaremos **Server Actions** (`signIn`, `signUp`, `signOut`, `getSession`) em `web/src/lib/auth/`.
- O "backend" dessas actions será um **stub em memória ou JSON local** com usuários de teste.
- A sessão será mantida em **cookie assinado HttpOnly**, lido pelo `proxy.ts` (ex-middleware) para proteger rotas `/app/*`.
- O formato do **session payload** seguirá um modelo compatível com **OIDC/JWT claims**: `sub`, `email`, `name`, `roles[]`, `specialties[]`, `tenants[]`, `exp`, `iat`. Isso garante que a troca por Keycloak, Auth.js (NextAuth v5), Clerk, Auth0 ou Supabase seja uma substituição da camada `lib/auth/*` sem mexer nas telas.

**Por quê:** o usuário conhece Keycloak e quer manter flexibilidade (provider-agnostic). O stub bem formatado permite desenhar e testar todas as telas do SaaS antes de qualquer decisão de provider, e quando a decisão for tomada, a UI não precisa mudar.

**Arquivo `proxy.ts` (ex-middleware)** vai:
1. Proteger `/app/*` e `/api/app/*` (redireciona pra `/login` se não houver sessão válida).
2. Não mexer em rotas públicas `(marketing)` e de auth `(auth)`.
3. Injetar headers com info da sessão pra Server Components consumirem via `headers()`.

**Atenção de segurança (Next.js 16):** o doc `data-security.md` recomenda validar auth/authz **dentro de cada Server Function** também, não apenas no proxy. O proxy é uma primeira camada; a verificação autoritativa fica no handler que acessa o dado. Vamos seguir isso.

### 3. Primeira persona — `athlete` completa + switcher mockado

Começamos construindo a experiência do **atleta** (ator central da plataforma), com 3 telas representativas:

| Rota | Conteúdo |
|---|---|
| `/app` | Dashboard: próximos compromissos, alertas, snapshot de performance, contratos ativos |
| `/app/perfil` | Perfil / portfólio do atleta (bio, mídia, achievements, visibilidade) |
| `/app/performance` | Histórico de métricas, benchmarks, gráficos por temporada |

Na **topbar**, um **persona switcher mockado** permitirá alternar para visões de outras personas (`parent_guardian`, `professional`, `org_admin`, `sponsor`, `platform_admin`) à medida que elas forem sendo construídas. Inicialmente, só `athlete` terá telas de verdade; as outras personas mostrarão um placeholder do tipo "em construção".

**Por quê:** o atleta é o centro gravitacional do produto — todas as outras personas consomem ou alimentam os mesmos dados dele. Construir ele primeiro define os componentes que serão reutilizados depois. Alternativa descartada: construir uma tela esqueleto por persona (fica raso e nenhuma fica "viva").

---

## Escopo desta primeira fase de construção (quando for implementada)

**Dentro do escopo:**
- Root layouts separados para `(marketing)`, `(app)` e `(auth)`.
- `proxy.ts` com proteção de `/app/*`.
- `lib/auth/` com Server Actions stub e tipos de sessão OIDC-like.
- Página de login e logout funcionais (contra o stub).
- Dashboard, perfil e performance do atleta com **dados mockados** (fixtures TypeScript alinhadas aos JSON Schemas em [`schemas/`](../schemas/)).
- Topbar com persona switcher (cosmético — não muda permissões de fato, só a visão).
- Sidebar navegacional do SaaS.

**Fora do escopo:**
- Integração real com provider de auth.
- API real ou banco.
- Telas das outras personas (além de placeholder).
- Upload de vídeo, mídia, contratos reais.
- Fluxos de consentimento LGPD funcionais (só o formato visual).
- Billing, pagamentos, marketplace.

---

## Convenções a seguir quando implementar

- **Mockdata**: criar fixtures em `web/src/lib/mock/` tipadas com os tipos gerados a partir dos JSON Schemas (`schemas/`). Usar as mesmas entidades: `User`, `Athlete`, `Tenant`, `ServiceContract`, `Consent`, etc.
- **Tipos a partir dos schemas**: avaliar gerar tipos TypeScript automaticamente com `json-schema-to-typescript` para manter `web/` sincronizado com `schemas/`. Se for manual nesta fase, comentar `// fonte: schemas/<arquivo>.json` nos tipos correspondentes.
- **Componentes reutilizáveis**: toda célula/card/chart usada no dashboard deve nascer genérica o suficiente para ser consumida pelas outras personas depois (ex.: `<AthleteSummaryCard>` vai aparecer tanto no dashboard do atleta quanto na visão do responsável e na do treinador).
- **Estrutura pastas dentro de `(app)`**: agrupar por **domínio** do [CLAUDE.md](../CLAUDE.md#domínios-principais-11), não por persona. Ex.: `(app)/app/performance/`, `(app)/app/portfolio/`, `(app)/app/carreira/`. A visão de cada persona é composta por pedaços dos mesmos domínios.
- **i18n-ready**: strings em português, mas centralizadas de forma que internacionalização futura seja viável (constantes ou dicionário por arquivo, sem hard-code espalhado).
- **Nada de emoji** nos arquivos/UI (seguindo regra global de estilo).

---

## Estado atual (2026-04-05)

**Persona `athlete` v1 completa.** A ordem de construção foi deliberadamente **trocada** em relação ao plano original: começamos pelo **perfil público do atleta** (`/atleta/[slug]`) em vez dos layouts + `proxy.ts` + auth, porque o perfil público é vitrine/canal de aquisição orgânica e não depende de auth. Na sequência construímos a vitrine pública `/atletas`, o stub de auth, o perfil editável e o histórico de performance — fechando as três telas centrais da persona atleta previstas no plano (dashboard, perfil, performance).

### Público / marketing

- **Schema `athlete.json`** ganhou `slug`, `profile.bio`, e o bloco required `visibility` com dois controles independentes:
  - `publicProfileEnabled` — habilita o link direto em `/atleta/[slug]`
  - `discoverable` — habilita listagem na vitrine pública `/atletas` (opt-in separado, especialmente importante para atletas menores de idade)
  - Flags granulares: `showPhoto`, `showAge`, `showCity`, `showPhysicalProfile`, `showHighlightVideos`, `showAchievements`, `showCurrentClub`, `showContact`. Defaults restritivos.
- **Types TypeScript** em `web/src/types/athlete.ts` e `web/src/types/performance.ts` alinhados aos JSON Schemas (comentário `// fonte:` no topo). Futuro: gerar via `json-schema-to-typescript`.
- **Mocks** em `web/src/lib/mock/`:
  - `athletes.ts` — dois atletas completos (João, armador sub-17, Paulistano; Mariana, ala-pivô sub-18, Fluminense) com bio inline, visibility diferenciada (João não é `discoverable`, Mariana é)
  - `performance.ts` — ~26 eventos históricos (13 por atleta) cobrindo uma temporada completa, misturando `match` e `assessment`, com narrativa de evolução visível no gráfico
  - `get-athlete.ts` e `get-performance.ts` com helpers memoizados via React `cache()`
- **Route group `(profile)`** — layout minimalista, página `/atleta/[slug]` sport-magazine (hero + bio + video YouTube + ficha física + conquistas + contato, tudo guiado por flags), `generateMetadata` com OpenGraph `type: profile`, `not-found.tsx` escopado com o mesmo visual editorial.
- **Vitrine `/atletas`** — Server Component puro com busca por nome + filtros (posição + categoria) via GET form/searchParams, componente `AthleteDirectoryCard` minimalista (foto + nome + posição + categoria + clube), dois empty states (sem resultados com fallback "em destaque", e vitrine vazia), `listDirectoryFacets` derivando opções de filtro apenas do subset discoverable.
- **`SiteNav` compartilhado** em `web/src/components/site-nav.tsx` com 3 variantes (`hero` sobre gradiente laranja, `primary` sticky laranja para páginas institucionais, `dark` sticky profile-surface para a vitrine). Usado pelas 7 páginas de marketing. Extraído após duplicação inline chegar a 6 arquivos.
- **Design system** — novo token `--profile-surface` (oklch por tema, basketball `0.12 0.02 260`, indigo `0.13 0.03 275`) substituindo `#0b0f1a` hardcoded em 11 ocorrências. Consistente em light/dark mode dentro de cada tema — decisão editorial.

### Autenticação e SaaS

- **Auth stub** (`web/src/lib/auth/`) com shape OIDC-like, trocável por provider real (Keycloak, Auth.js, Clerk, Auth0) sem mexer em UI:
  - `session.ts` — JWT HS256 via `jose`, cookie HttpOnly `eco-sports-session`, payload com claims `sub`, `email`, `name`, `roles[]`, `specialties[]`, `tenants[]`
  - `mock-users.ts` — dois usuários demo (joao@, mariana@) sem hash, com mapping user → athleteId separado do JWT (claims puras)
  - `dal.ts` — Data Access Layer com `verifySession`, `getCurrentUser`, `getCurrentAthlete`, `getOptionalSession`, todos memoizados via `cache()`. Autorização autoritativa.
  - `actions.ts` — Server Actions `signIn` e `signOut` com validação Zod
  - `.env.local` com `SESSION_SECRET` (gitignored)
- **`proxy.ts`** (`web/src/proxy.ts`, ex-middleware) — optimistic check do cookie, redireciona `/app/*` pra `/login?next=...` quando sem sessão e usuário logado em `/login` pra `/app/perfil`.
- **Route group `(auth)`** — layout minimalista centrado + `/login` com form client (`useActionState`) e hint de credenciais demo.
- **Route group `(app)`** — shell autenticado com sidebar + topbar + persona switcher cosmético (6 personas, só `athlete` funcional; as outras vão pra `/app/em-construcao`), sign-out via Server Action.
- **`/app`** — dashboard stub com saudação e link pro perfil.
- **`/app/perfil`** — editor completo do atleta (identidade, esporte, ficha física, carreira, mídia, contato, privacidade granular) com master switch `publicProfileEnabled` + toggle separado `discoverable` + toggles por seção. Server Action `saveProfile` com validação Zod, mutação in-place e `revalidatePath` para `/atleta/[slug]` e `/atletas`.
- **`/app/performance`** — histórico com tabs `Partidas` / `Avaliações`. Cada tab tem 4 stat cards (médias das últimas 5 / última medição), gráfico de linha em recharts (pontos/assistências/rebotes para partidas; impulsão vertical para avaliações — strokes em CSS custom properties dos tokens de tema), e lista cronológica completa com stats inline por evento. Server Action `addPerformanceEvent` com Zod discriminated union por `sourceType`, mesmo padrão de mutação in-place + revalidation.
- **`/app/em-construcao`** — placeholder condicional que lê `?persona=` e mostra o nome amigável da persona pedida.

### Convenções já estabelecidas pelo trabalho até aqui

- **Mutação in-memory** é o padrão para todos os Server Actions enquanto não há backend real. Sobrevive dentro do processo do dev server, reseta no restart. Trivialmente substituível por `DB write` quando o backend existir.
- **`revalidatePath`** sempre chamado após mutação para invalidar páginas dependentes (ex: `saveProfile` invalida `/atleta/[slug]` antigo e novo + `/atletas`; `addPerformanceEvent` invalida `/app/performance`).
- **React `cache()`** em todo fetcher — garante que a mesma request não duplique trabalho entre `generateMetadata`, Server Components e Server Actions.
- **Zod discriminated unions** para formulários que têm variantes (ex: `CreateEventSchema` com `match | assessment` — mesma Server Action valida ambos).
- **DAL autoritativa** em cada Server Component/Action que toca dado sensível — `proxy.ts` é só a primeira camada, não é suficiente.
- **Tokens semânticos** no design system — nenhuma cor hardcoded nova deve ser aceita; se precisar de uma cor novea, criar token.

### Próximos passos

1. **Segunda persona — `parent_guardian`**. Destrava o persona switcher, força decisões de multi-user-per-athlete e workflows de aprovação, e é legalmente necessária para atletas menores (fluxo de consentimento + aprovação de `discoverable`/`publicProfileEnabled` quando o atleta é menor).
2. **Consent flow LGPD** — usar o schema `consent.json` que já existe em `schemas/` (atualmente untracked no Grupo C). Tela dedicada em `/app/consentimentos` com versionamento e aprovação de responsável.
3. **Signup** — criar um atleta do zero, não só editar. Mesma infra de Server Action + Zod do login.
4. **Unicidade de slug** — hoje `saveProfile` não checa colisão. Adicionar check + mensagem de erro.
5. **Upload de foto** — compromisso inicial (base64 inline, URL data:) enquanto não há storage.
6. **Mais atletas mock** — a vitrine está com apenas 1 atleta visível (Mariana). 5-8 atletas variados deixariam os filtros mais úteis.
7. **Eventualmente**: migração das páginas de marketing para dentro de um grupo `(marketing)` — hoje estão flat em `src/app/`, não urgente.

### Ao continuar a implementação

- Reler este doc e [actors-permissoes.md](actors-permissoes.md).
- Reler os docs do Next.js 16 em `web/node_modules/next/dist/docs/01-app/` (especialmente `authentication.md`, `data-security.md`, `multi-tenant.md`, `route-groups.md`, `proxy.md`) antes de escrever qualquer código — essa versão tem mudanças em relação ao que modelos de linguagem conhecem como Next.js.
- Seguir as convenções estabelecidas acima (mutação in-memory, revalidatePath, `cache()`, Zod, DAL, tokens) para não quebrar consistência.
