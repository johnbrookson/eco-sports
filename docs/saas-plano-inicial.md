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

**Em implementação ativa.** A ordem de construção foi deliberadamente **trocada** em relação ao plano original: em vez de começar pelos root layouts, `proxy.ts` e stub de auth, fomos direto pelo **perfil público do atleta** (`/atleta/[slug]`). Motivo: o perfil público é vitrine/canal de aquisição orgânica, não depende de auth, e sua estética (sport-magazine, editorial) é muito diferente da do SaaS — começar por ele define o tom visual e o ponto de entrada externo da plataforma antes de investirmos na complexidade da área autenticada.

### Já construído

- **Schema `athlete.json`** ganhou os campos `slug` (pattern `^[a-z0-9][a-z0-9-]{2,59}$`, único por tenant, editável pelo atleta) e o bloco required `visibility` com master switch `publicProfileEnabled` + 8 flags granulares (`showPhoto`, `showAge`, `showCity`, `showPhysicalProfile`, `showHighlightVideos`, `showAchievements`, `showCurrentClub`, `showContact`). Defaults restritivos — o atleta opta por expor.
- **Types TypeScript** em `web/src/types/athlete.ts` alinhados ao JSON Schema (com comentário `// fonte: schemas/athlete.json`). Futuro: gerar via `json-schema-to-typescript`.
- **Mocks** em `web/src/lib/mock/athletes.ts` — dois atletas completos de basquete de base (armador sub-17 em São Paulo, ala-pivô sub-18 no Rio) com bios editoriais separadas em `mockAthleteBios`. Helper `getAthleteBySlug` memoizado com React `cache()` em `web/src/lib/mock/get-athlete.ts`, respeitando `publicProfileEnabled` (retorna `null` e dispara 404 se desabilitado).
- **Route group `(profile)`** com layout próprio minimalista: header absoluto sobre o hero (logo + CTA "Criar meu perfil") + footer discreto com link pra plataforma. Não herda nav institucional nem chrome de SaaS.
- **Página `/atleta/[slug]`** em estilo sport-magazine — seções condicionais guiadas por `visibility`: hero full-bleed com gradient duplo e nome em duas linhas (primeiro branco, sobrenome em `--primary`), bio editorial, highlight video embed (YouTube, parser interno), ficha física em grid com números gigantes, conquistas numeradas estilo pauta, bloco de contato com até 4 canais.
- **`generateMetadata`** dinâmica — `title`, `description`, OpenGraph `type: profile` com a foto do atleta, Twitter card. Compartilhar o link gera preview rico.
- **`generateStaticParams`** gerando SSG dos slugs conhecidos (`joao-silva-2008`, `mariana-costa-2007`). `dynamicParams` default = true, então slugs desconhecidos caem no 404 customizado via renderização on-demand.
- **`not-found.tsx` customizado** escopado em `(profile)/atleta/[slug]/not-found.tsx`, mesmo visual do perfil real (hero escuro, badges, duas linhas na headline "Atleta / fora de quadra", 2 CTAs). Cobre tanto slug inexistente quanto `publicProfileEnabled=false` — do ponto de vista do visitante é indistinguível, o que é a privacidade correta.
- **`next.config.ts`** com `images.remotePatterns` para `images.unsplash.com` (fotos mock). Substituir por bucket S3-compatible quando upload real existir.

### Próximos passos

1. **Perfil editável interno** — `(app)/perfil` (ou rota equivalente) com forms para todos os campos do schema e os toggles de visibilidade. Vai forçar as decisões de `(app)` + auth stub + `proxy.ts` que estavam no plano original.
2. **Stub de auth agnóstico** (Server Actions, cookie assinado, payload OIDC-like) — conforme decisão 2 do plano original, preservada.
3. **Dashboard e `/app/performance`** do atleta (decisão 3 original: persona `athlete` completa).
4. **Persona switcher mockado** na topbar e placeholders para outras personas.
5. **Eventualmente**: migração das páginas de marketing para dentro de um grupo `(marketing)` — hoje elas estão flat em `src/app/`, não urgente.

### Ao continuar a implementação

- Reler este doc e [actors-permissoes.md](actors-permissoes.md).
- Reler os docs do Next.js 16 em `web/node_modules/next/dist/docs/01-app/` (especialmente `authentication.md`, `data-security.md`, `multi-tenant.md`, `route-groups.md`, `proxy.md`) antes de escrever qualquer código — essa versão tem mudanças em relação ao que modelos de linguagem conhecem como Next.js.
