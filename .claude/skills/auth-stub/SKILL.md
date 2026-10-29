---
name: auth-stub
description: Use when working on authentication, authorization, session management, the login flow, the protected /app/* routes, the proxy.ts (ex-middleware), the Data Access Layer, Firebase Authentication (session cookie, emulator, demo users seed), or anything that touches the session cookie.
---

> **Manutenção desta skill**: última revisão refletindo a **troca do stub JWT pelo Firebase Authentication** (Fase 2 de `docs/migracao-firebase.md`, 2026-10-29). Antes disso: implementação do **signup** (criação de conta para atleta e guardian, Server Action `signUp` com Zod discriminated union, geração de Athlete skeleton + GuardianRelationship in-memory). Se você mudou algo em `lib/auth/`, `lib/guardian/`, `proxy.ts`, `(auth)/`, ou trocou o provider de auth, atualize esta skill **no mesmo commit** ou commit adjacente. Ver `git log -- .claude/skills/auth-stub/` para histórico.

# Auth — Firebase Authentication, session, DAL, proxy, login

Autenticação e autorização no basketball.net. Começou como stub JWT com shape OIDC-like justamente para a troca de provider ser local a `lib/auth/`. Em 2026-10-29 a troca aconteceu: **identidade e senha vivem no Firebase Authentication**, a sessão é um **session cookie do Admin SDK**, e nenhuma tela, DAL ou `proxy.ts` mudou. O nome da skill ficou por histórico.

**O que ainda é stub:** o mapping usuário → domínio (`roles`, `tenants`, `athleteId`, `managedAthleteIds`) segue in-memory em `mock-users.ts`, indexado pelo **uid do Firebase**. Vai para as tabelas `User`/`OrganizationMembership` do Data Connect na Fase 3.

## Imperativo (30 segundos)

- **Leia a skill `conventions` primeiro** se ainda não leu nesta conversa.
- **DAL é autoritativo, proxy é primeira linha.** Nunca conte apenas com o proxy pra proteger dado sensível. Toda Server Component em `(app)/*` e toda Server Action que lê/muta dado deve chamar `getCurrentUser()`, `getCurrentAthlete()` ou `verifySession()` do `lib/auth/dal.ts`.
- **Claims do JWT são PURAS.** Apenas identidade e autorização (`sub`, `email`, `name`, `roles[]`, `specialties[]`, `tenants[]`, `iat`, `exp`). Dados do domínio (athleteId, managedAthletes, etc) **não** entram no JWT — ficam no mapping user → domínio em `mock-users.ts` (ou em banco, no futuro real).
- **Invariante de provider**: o provider (hoje Firebase) fica encapsulado em `lib/auth/firebase.ts`, `session.ts` e `actions.ts`. **Zero conhecimento de Firebase em UI, DAL consumers ou páginas**. Se uma mudança quebra essa invariante, é bug.
- **Sem SDK do Firebase no cliente.** O login continua sendo Server Action com `useActionState`: a action confere e-mail e senha pela REST do Identity Toolkit (`signInWithPassword` em `firebase.ts`) e troca o ID token por session cookie (`createSessionCookie`). Não adicione `firebase` (client SDK) só para login.
- **Papéis não vêm de custom claims.** O payload junta identidade do session cookie (uid, email, iat, exp) com papéis/tenants do mapping. Mudar papel não exige renovar token.
- **Nunca leia `cookies()` direto fora de `session.ts`.** Qualquer outro código que precisa da sessão vai pelo DAL.
- **Cookie de sessão é HttpOnly, Secure em produção, SameSite lax, path /, expira em 7d.** Não customize isso por módulo.
- **Cookie de persona `eco-sports-persona`** — **não** é HttpOnly (lido pelo client pra renderização condicional). Setado pelo `signIn` com `roles[0]` do user. Lido pelo DAL via `getCurrentPersona()`. Não contém segredo — apenas o nome da role ativa.
- **Localmente, use o emulador do Auth** (`FIREBASE_AUTH_EMULATOR_HOST` + `GCLOUD_PROJECT=demo-basketball-net` em `web/.env.local`, `npm run emulators`, `npm run seed:auth`). Sem emulador nem credenciais, o login falha loud. Passo a passo em `web/README.md`. Não existe mais `SESSION_SECRET`.

## Arquitetura — 4 camadas

```
┌──────────────────────────────────────────────────────────────┐
│  Usuário                                                     │
├──────────────────────────────────────────────────────────────┤
│  1. proxy.ts  (src/proxy.ts, Next.js 16)                     │
│     - Optimistic check do cookie                             │
│     - Redireciona /app/* sem sessão → /login?next=<path>     │
│     - Redireciona /login com sessão → /app/perfil            │
│     - Não é autoritativo. Pode ser burlado por bug.          │
├──────────────────────────────────────────────────────────────┤
│  2. DAL  (src/lib/auth/dal.ts)                               │
│     - verifySession() → redirect /login se inválida          │
│     - getCurrentUser() → MockUser                            │
│     - getCurrentAthlete() → Athlete                          │
│     - getOptionalSession() → SessionPayload | null           │
│     - Memoizadas via React cache() por request               │
│     - AUTORITATIVA. Vive junto do dado.                      │
├──────────────────────────────────────────────────────────────┤
│  3. Session  (src/lib/auth/session.ts)                       │
│     - createSession(idToken) → createSessionCookie (Admin)   │
│     - decrypt(cookie) → verifySessionCookie + mapping        │
│     - getSession() / deleteSession()                         │
│     - Lê/escreve cookie HttpOnly. server-only                │
├──────────────────────────────────────────────────────────────┤
│  4. Firebase  (src/lib/auth/firebase.ts)                     │
│     - getAdminAuth() → Admin SDK (ADC no App Hosting,        │
│       emulador se FIREBASE_AUTH_EMULATOR_HOST)               │
│     - signInWithPassword() → REST do Identity Toolkit        │
├──────────────────────────────────────────────────────────────┤
│  5. Mapping  (src/lib/auth/mock-users.ts)                    │
│     - mockUsers indexado pelo uid do Firebase: roles,        │
│       tenants, athleteId, managedAthleteIds. Sem senha.      │
│     - findMockUserById() / findMockUserByEmail() /           │
│       addMockUser() (signup)                                 │
│     - Vira tabela User/OrganizationMembership na Fase 3      │
└──────────────────────────────────────────────────────────────┘
```

## Session payload — formato OIDC-like

```ts
interface SessionPayload {
  sub: string;           // user id — OIDC subject claim
  email: string;
  name: string;
  roles: string[];       // ["athlete"], ["parent_guardian"], ["org_admin"], etc
  specialties: string[]; // para professional: ["coach"], ["scout"], ["psychologist"]
  tenants: string[];     // tenants que o usuário pertence
  iat?: number;          // issued-at do session cookie
  exp?: number;          // expiração, 7 dias
}
```

**Por que este shape?** É um subset de JWT claims padrão do OpenID Connect, e foi o que permitiu trocar o stub pelo Firebase sem mexer em nenhum consumidor. `decrypt()` monta o payload: `sub`/`email`/`iat`/`exp` do session cookie verificado, `name`/`roles`/`specialties`/`tenants` do mapping. Se o uid não tem mapping, `decrypt()` devolve `null` (sessão inválida).

**O que NÃO entra no payload:**
- `athleteId`, `managedAthleteIds`, `organizationId` — mapping domain-specific fica em `mock-users` (ou no banco quando real)
- `permissions` granulares — derivar de `roles + specialties` no DAL, não pré-computar
- Dados sensíveis (phone, address, etc) — JWT não é lugar pra PII

## Arquivos-chave

- [web/src/lib/auth/firebase.ts](../../../web/src/lib/auth/firebase.ts) — Admin SDK (`getAdminAuth`) e login por senha via REST (`signInWithPassword`, com erros normalizados em `invalid-credentials` / `too-many-attempts` / `unavailable`). A API key pública vem de `FIREBASE_API_KEY`, que o `next.config.ts` copia do `FIREBASE_WEBAPP_CONFIG` no build do App Hosting. `"server-only"` no topo.
- [web/src/lib/auth/session.ts](../../../web/src/lib/auth/session.ts) — session cookie do Firebase e cookie IO. `"server-only"` no topo.
- [web/src/lib/auth/mock-users.ts](../../../web/src/lib/auth/mock-users.ts) — mapping de usuários indexado pelo uid do Firebase: `roles[]`, `specialties[]`, `tenants[]`, `athleteId` e `managedAthleteIds` opcionais. Sem senha. `"server-only"` no topo.
- [web/scripts/seed-demo-users.mjs](../../../web/scripts/seed-demo-users.mjs) — `npm run seed:auth`: cria/atualiza os usuários demo no Firebase (emulador ou projeto real) com o mesmo uid do mapping. Idempotente. As senhas demo vivem aqui.
- [web/src/lib/auth/dal.ts](../../../web/src/lib/auth/dal.ts) — **o arquivo mais importante do módulo**. Camada autoritativa. Cada função memoizada via `cache()`. Se uma função aqui redireciona, ela chama `redirect()` do `next/navigation` — nunca retorna null pra chamador tratar (decisão: força o caller a assumir que sessão é válida depois da chamada).
- [web/src/lib/auth/actions.ts](../../../web/src/lib/auth/actions.ts) — Server Actions `signIn`, `signOut` e `signUp`. `signIn` valida com Zod, confere a senha no Firebase, exige mapping para o uid e abre a sessão com o ID token. `signUp` usa dois Zod schemas (atleta vs guardian), cria o usuário no Firebase via Admin SDK (`registerFirebaseUser`, com o uid gerado para o mapping) **antes** de criar MockUser + Athlete skeleton ou MockUser + GuardianRelationship in-memory, depois `createSession` + redirect. Usa `useActionState` no client.
- [web/src/proxy.ts](../../../web/src/proxy.ts) — proxy Next.js 16. Exporta `proxy` (não `middleware`). Matcher exclui `_next/static`, `_next/image`, `favicon.ico` e arquivos com extensão. Protege `/app/*`, redireciona `/login` e `/signup` se logado.
- [web/src/app/(auth)/layout.tsx](../../../web/src/app/(auth)/layout.tsx) — layout minimalista centrado do grupo auth.
- [web/src/app/(auth)/login/page.tsx](../../../web/src/app/(auth)/login/page.tsx) — página de login Server Component.
- [web/src/app/(auth)/login/login-form.tsx](../../../web/src/app/(auth)/login/login-form.tsx) — form client com `useActionState`, exibe erros inline.
- [web/src/app/(auth)/signup/page.tsx](../../../web/src/app/(auth)/signup/page.tsx) — página de signup Server Component com link cruzado pra login.
- [web/src/app/(auth)/signup/signup-form.tsx](../../../web/src/app/(auth)/signup/signup-form.tsx) — form client com `useActionState` e seletor de role (athlete/guardian). Campos condicionais: birthDate (atleta) e athleteEmail (guardian).
- [web/src/lib/guardian/actions.ts](../../../web/src/lib/guardian/actions.ts) — Server Action `resolveVisibilityApproval` para aprovar/rejeitar mudanças de visibilidade pendentes de atletas menores. Autorizada via `requireGuardianOf`.
- [web/src/lib/mock/guardian-relationships.ts](../../../web/src/lib/mock/guardian-relationships.ts) — mock de `GuardianRelationship` + helpers `getGuardianRelationshipsForUser` e `getGuardianRelationshipForAthlete`, memoizados via `cache()`.

## Usuários demo

Quatro contas. O mapping fica em `mock-users.ts`; a conta (e-mail + senha) é criada no Firebase por `npm run seed:auth` com o mesmo uid:

| Email | Senha | uid | Role | Vinculado |
|---|---|---|---|---|
| `joao@demo.basketball.net` | `joao123` | `usr-joao` | `athlete` | João Silva (sub-17, Paulistano, menor) |
| `mariana@demo.basketball.net` | `mariana123` | `usr-mariana` | `athlete` | Mariana Costa (sub-18, Fluminense, maior) |
| `enrico@demo.basketball.net` | `enrico123` | `usr-enrico` | `athlete` | Enrico Ceron (sub-15, SPFC Basket Base, menor) |
| `rodrigo@demo.basketball.net` | `rodrigo123` | `usr-rodrigo` | `parent_guardian` | Gerencia Enrico (via `managedAthleteIds`) |

Usuário demo novo = entrada no `mockUsers` + entrada no `DEMO_USERS` do seed, com o mesmo uid, no mesmo commit.

`MockUser` tem `managedAthleteIds?: string[]` para o mapping domain de guardians. Mesmo padrão do `athleteId` — vive no mock, não no JWT.

Quando for adicionar personas futuras (`professional`, `org_admin`, `sponsor`, `platform_admin`), adicione mock users correspondentes **no mesmo commit** da tela deles, não antes.

## Firebase — como o login funciona

1. `signIn` valida com Zod e chama `signInWithPassword(email, senha)` (REST `accounts:signInWithPassword`). O Firebase devolve `localId` (uid) + `idToken`.
2. A action exige mapping (`findMockUserById(uid)`). Sem mapping, erro de form explicando o ambiente demo (mapping in-memory perdido num restart).
3. `createSession(idToken)` chama `createSessionCookie` (7 dias) e grava no cookie `eco-sports-session` (nome antigo mantido para não derrubar sessões; trocar junto com o rebrand de cookies).
4. A cada request, `decrypt()` faz `verifySessionCookie` (chaves públicas do Google, cacheadas pelo Admin SDK) e monta o payload.

**Ambientes:**

- **App Hosting:** `initializeApp()` sem argumentos usa a conta de serviço do backend e o `FIREBASE_CONFIG` injetado. A conta de serviço precisa de permissão no Firebase Auth (criar usuário, emitir session cookie). Se o signup ou o login falharem com erro de permissão no log, conceder o papel "Firebase Authentication Admin" a `firebase-app-hosting-compute@<projeto>.iam.gserviceaccount.com`.
- **Local:** emulador do Auth. O emulador aceita qualquer API key e emite tokens sem assinatura; não use os testes locais para validar adulteração de cookie.
- **Provedor Email/Password** precisa estar ativo em Authentication → Método de login no console.

**Fase 3 (Data Connect):** trocar `findMockUserById`/`addMockUser` por queries em `User`/`OrganizationMembership`, criando a linha `User` na mesma operação do signup. `session.ts` e `actions.ts` mudam pouco; DAL, proxy e UI não mudam.

## Padrões estabelecidos

### `verifySession` vs `getCurrentUser` vs `getCurrentAthlete`

Três níveis, em ordem crescente de especificidade:

- `verifySession()` — usa quando você só precisa saber que há sessão válida, não o usuário em si. Retorna `SessionPayload`.
- `getCurrentUser()` — usa quando precisa do `MockUser` completo (roles, specialties, tenants, athleteId). Já chama `verifySession` por baixo.
- `getCurrentAthlete()` — usa em Server Components/Actions do contexto do atleta. Garante que o user tem `athleteId` (se não tem, redireciona pra `em-construcao`). Já chama `getCurrentUser` por baixo.

**Sempre chame o mais específico possível.** Não use `getCurrentUser` se `getCurrentAthlete` serve — o mais específico valida mais precondições por você.

### `getCurrentPersona` — persona ativa

Lê o cookie `eco-sports-persona` e valida contra as roles reais do user. Se o cookie não existe ou contém uma role que o user não possui, faz fallback pra `roles[0]`. Usado pelo layout, dashboard e sidebar pra renderizar conteúdo específico por persona.

```ts
const persona = await getCurrentPersona(); // "athlete" | "parent_guardian" | ...
```

### `getManagedAthletesForCurrentUser` — atletas do guardian

Retorna os atletas supervisionados pelo user autenticado, via `managedAthleteIds` do `MockUser`. Para users sem `managedAthleteIds` (ex: athlete), retorna array vazio. Usado no dashboard e na listagem do guardian.

### `requireGuardianOf(athleteId)` — autorização de guardian

Verifica que o user autenticado é um `parent_guardian` com relação ativa ao atleta indicado. Redireciona para `/app` se não tiver autorização. Retorna `GuardianRelationship` completo para que o caller possa checar `legallyResponsible`, `isPrimary`, etc.

```ts
const relationship = await requireGuardianOf(params.id);
if (!relationship.legallyResponsible) { /* ... */ }
```

### `getOptionalSession` — para código híbrido público/autenticado

Quando uma tela funciona para visitantes anônimos mas muda algo pra usuários logados (ex: exibe "Editar" no perfil público se o usuário é o próprio atleta), use `getOptionalSession`. **Não faz redirect**, retorna `null` se não há sessão.

```ts
const session = await getOptionalSession();
const isOwner = session?.sub === athlete.ownerUserId;
```

### Signup — `signUp` Server Action

Fluxo de criação de conta em `/signup`, rota única com seletor de role (athlete / parent_guardian). Mesma infra do `signIn`: Server Action + Zod + `useActionState` + `createSession` + redirect.

**Fluxo atleta:** campos comuns (nome, email, senha, confirmação) + `birthDate` → cria `MockUser` com `roles: ["athlete"]` + `Athlete` skeleton in-memory (slug auto-gerado, categoria derivada da idade, visibility toda fechada) → `createSession` → redirect `/app/perfil` pra completar o perfil.

**Fluxo guardian:** campos comuns + `athleteEmail` (email da conta do atleta) → busca o `MockUser` do atleta por email → cria `MockUser` com `roles: ["parent_guardian"]` + `managedAthleteIds` + `GuardianRelationship` in-memory → `createSession` → redirect `/app` (dashboard).

**Validações Zod:** dois schemas selecionados por role (não discriminated union — `.refine()` não é compatível com `z.discriminatedUnion`). Email único entre `mockUsers`. Senha min 6 chars. Confirmação de senha. BirthDate entre 8-30 anos (atleta). AthleteEmail deve apontar pra user existente com `athleteId` (guardian).

**TenantId:** hardcoded `tenant-demo-individual` para todos os novos users no stub.

**Slug gerado:** `generateAthleteSlug(firstName, lastName, birthDate, tenantId)` em `get-athlete.ts`. Transliteração simples (remove acentos, lowercase, hífens). Sufixo numérico se colidir.

**Categoria derivada:** `deriveCategoryFromBirthDate(birthDate)` em `get-athlete.ts`. Retorna sub-13 a adulto.

### Redirect loops — cuidados

O `proxy.ts` redireciona `/app/*` sem sessão → `/login`, e auth routes (`/login`, `/signup`) com sessão → `/app/perfil`. Se as duas regras ativassem simultaneamente, haveria loop. A proteção: cada regra checa exclusivamente seu próprio conjunto de paths. **Não adicione regras que cruzem esses limites** sem testar manualmente em browser.

## Anti-patterns específicos do domínio

- **Não leia `cookies()` direto** fora de `session.ts`. Se você precisa da sessão noutro lugar, importe do DAL.
- **Não coloque dados do domínio em custom claims do Firebase** (athleteId, managed relationships, papéis). Claims são puras; o domínio vem do mapping.
- **Não guarde senha no mapping.** Senha só existe no Firebase (e, para os demo, no script de seed).
- **Não pule o DAL "porque o proxy já protegeu"**. O DAL é a linha autoritativa.
- **Não retorne `null` de funções "verify"** — redirecione. A semântica das funções `verify*` é "depois disto, assume que é válido".
- **Não desabilite o proxy matcher em paths de `/app/*`** em nome de performance. A proteção vem antes da performance.
- **Não adicione novas flags de role ad hoc** no `mockUsers`. Se precisar de uma role nova, discuta como ela se encaixa em `docs/actors-permissoes.md` primeiro.
- **Não implemente signup sem checar `tenantId`**. O modelo é multi-tenant desde o design, mesmo que o stub só tenha um tenant hoje.

## Para profundidade, ler

- [web/node_modules/next/dist/docs/01-app/02-guides/authentication.md](../../../web/node_modules/next/dist/docs/01-app/02-guides/authentication.md) — guia oficial do Next.js 16 sobre o padrão que estamos seguindo (seções "Session Management" e "Creating a Data Access Layer")
- [web/node_modules/next/dist/docs/01-app/02-guides/data-security.md](../../../web/node_modules/next/dist/docs/01-app/02-guides/data-security.md) — razão arquitetural de "authorize close to the data"
- [web/node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md](../../../web/node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md) — especifica que `middleware.ts` virou `proxy.ts` no Next.js 16
- [docs/saas-plano-inicial.md](../../../docs/saas-plano-inicial.md) — seção "SaaS autenticado" para contexto narrativo
- Skill `athlete-profile` — se você está mexendo no `(app)/perfil` e precisa entender como o DAL conecta ao athlete
