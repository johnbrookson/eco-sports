---
name: auth-stub
description: Use when working on authentication, authorization, session management, the login flow, the protected /app/* routes, the proxy.ts (ex-middleware), the Data Access Layer, or anything that touches the JWT cookie. Also invoke when planning to swap the stub for a real auth provider (Keycloak, Auth.js, Clerk, Auth0, Supabase) — the skill covers the invariants that make the swap trivial.
---

> **Manutenção desta skill**: última revisão refletindo o estado até a implementação do **signup** (criação de conta para atleta e guardian, Server Action `signUp` com Zod discriminated union, geração de Athlete skeleton + GuardianRelationship in-memory). Se você mudou algo em `lib/auth/`, `lib/guardian/`, `proxy.ts`, `(auth)/`, ou trocou o provider de auth, atualize esta skill **no mesmo commit** ou commit adjacente. Ver `git log -- .claude/skills/auth-stub/` para histórico.

# Auth stub — session, DAL, proxy, login

Autenticação e autorização no Eco-Sports. Intencionalmente um stub durante o MVP, **shape OIDC-like para tornar a troca por provider real uma substituição local** em `lib/auth/` sem mexer em nenhuma tela.

## Imperativo (30 segundos)

- **Leia a skill `conventions` primeiro** se ainda não leu nesta conversa.
- **DAL é autoritativo, proxy é primeira linha.** Nunca conte apenas com o proxy pra proteger dado sensível. Toda Server Component em `(app)/*` e toda Server Action que lê/muta dado deve chamar `getCurrentUser()`, `getCurrentAthlete()` ou `verifySession()` do `lib/auth/dal.ts`.
- **Claims do JWT são PURAS.** Apenas identidade e autorização (`sub`, `email`, `name`, `roles[]`, `specialties[]`, `tenants[]`, `iat`, `exp`). Dados do domínio (athleteId, managedAthletes, etc) **não** entram no JWT — ficam no mapping user → domínio em `mock-users.ts` (ou em banco, no futuro real).
- **Invariante da troca de provider**: trocar Keycloak/Auth.js/Clerk/Auth0/Supabase deve mexer apenas em `lib/auth/session.ts` + `lib/auth/actions.ts`. **Zero mudança em UI, DAL consumers ou páginas**. Se uma mudança quebra essa invariante, é bug.
- **Nunca leia `cookies()` direto fora de `session.ts`.** Qualquer outro código que precisa da sessão vai pelo DAL.
- **Cookie de sessão é HttpOnly, Secure em produção, SameSite lax, path /, expira em 7d.** Não customize isso por módulo.
- **Cookie de persona `eco-sports-persona`** — **não** é HttpOnly (lido pelo client pra renderização condicional). Setado pelo `signIn` com `roles[0]` do user. Lido pelo DAL via `getCurrentPersona()`. Não contém segredo — apenas o nome da role ativa.
- **`SESSION_SECRET` é obrigatório** e vive em `web/.env.local` (gitignored). A função `getEncodedKey()` falha loud se não estiver definido.

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
│     - encrypt() / decrypt() via jose HS256                   │
│     - createSession() / getSession() / deleteSession()       │
│     - Lê/escreve cookie HttpOnly                             │
│     - server-only (não importa em Client Components)         │
├──────────────────────────────────────────────────────────────┤
│  4. Mock users  (src/lib/auth/mock-users.ts)                 │
│     - mockUsers array com email + password plain + role +    │
│       tenants + athleteId (mapping, não vai pro JWT)         │
│     - findMockUserByCredentials() / findMockUserById()       │
│     - findMockUserByEmail() / addMockUser() (signup)         │
│     - Substituído por query em banco no futuro real          │
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
  iat?: number;          // issued-at, adicionado por jose
  exp?: number;          // expiração, 7 dias
}
```

**Por que este shape?** É um subset de JWT claims padrão do OpenID Connect. Keycloak emite isso nativamente. Auth.js (NextAuth v5) mapeia pra isso. Clerk, Auth0 e Supabase todos têm equivalentes. Trocar provider é copiar os claims que o provider devolve pra esse shape — nada mais.

**O que NÃO entra no payload:**
- `athleteId`, `managedAthleteIds`, `organizationId` — mapping domain-specific fica em `mock-users` (ou no banco quando real)
- `permissions` granulares — derivar de `roles + specialties` no DAL, não pré-computar
- Dados sensíveis (phone, address, etc) — JWT não é lugar pra PII

## Arquivos-chave

- [web/src/lib/auth/session.ts](../../../web/src/lib/auth/session.ts) — crypto, cookie IO. Se trocar provider, este arquivo muda bastante. `"server-only"` no topo.
- [web/src/lib/auth/mock-users.ts](../../../web/src/lib/auth/mock-users.ts) — fixture de usuários. Cada um tem `password` plain text (stub explícito), `roles[]`, `specialties[]`, `tenants[]`, e `athleteId` opcional como mapping domain. `"server-only"` no topo.
- [web/src/lib/auth/dal.ts](../../../web/src/lib/auth/dal.ts) — **o arquivo mais importante do módulo**. Camada autoritativa. Cada função memoizada via `cache()`. Se uma função aqui redireciona, ela chama `redirect()` do `next/navigation` — nunca retorna null pra chamador tratar (decisão: força o caller a assumir que sessão é válida depois da chamada).
- [web/src/lib/auth/actions.ts](../../../web/src/lib/auth/actions.ts) — Server Actions `signIn`, `signOut` e `signUp`. `signIn` tem Zod validation, retorna `SignInFormState` com erros por campo + mensagem de form. `signUp` usa dois Zod schemas (atleta vs guardian) selecionados por role, cria MockUser + Athlete skeleton (atleta) ou MockUser + GuardianRelationship (guardian) in-memory, depois chama `createSession` + redirect. Usa `useActionState` no client.
- [web/src/proxy.ts](../../../web/src/proxy.ts) — proxy Next.js 16. Exporta `proxy` (não `middleware`). Matcher exclui `_next/static`, `_next/image`, `favicon.ico` e arquivos com extensão. Protege `/app/*`, redireciona `/login` e `/signup` se logado.
- [web/src/app/(auth)/layout.tsx](../../../web/src/app/(auth)/layout.tsx) — layout minimalista centrado do grupo auth.
- [web/src/app/(auth)/login/page.tsx](../../../web/src/app/(auth)/login/page.tsx) — página de login Server Component.
- [web/src/app/(auth)/login/login-form.tsx](../../../web/src/app/(auth)/login/login-form.tsx) — form client com `useActionState`, exibe erros inline.
- [web/src/app/(auth)/signup/page.tsx](../../../web/src/app/(auth)/signup/page.tsx) — página de signup Server Component com link cruzado pra login.
- [web/src/app/(auth)/signup/signup-form.tsx](../../../web/src/app/(auth)/signup/signup-form.tsx) — form client com `useActionState` e seletor de role (athlete/guardian). Campos condicionais: birthDate (atleta) e athleteEmail (guardian).
- [web/src/lib/guardian/actions.ts](../../../web/src/lib/guardian/actions.ts) — Server Action `resolveVisibilityApproval` para aprovar/rejeitar mudanças de visibilidade pendentes de atletas menores. Autorizada via `requireGuardianOf`.
- [web/src/lib/mock/guardian-relationships.ts](../../../web/src/lib/mock/guardian-relationships.ts) — mock de `GuardianRelationship` + helpers `getGuardianRelationshipsForUser` e `getGuardianRelationshipForAthlete`, memoizados via `cache()`.

## Usuários demo

Quatro contas no `mock-users.ts`:

| Email | Senha | Role | Vinculado |
|---|---|---|---|
| `joao@demo.ecosports.app` | `joao123` | `athlete` | João Silva (sub-17, Paulistano, menor) |
| `mariana@demo.ecosports.app` | `mariana123` | `athlete` | Mariana Costa (sub-18, Fluminense, maior) |
| `enrico@demo.ecosports.app` | `enrico123` | `athlete` | Enrico Ceron (sub-15, SPFC Basket Base, menor) |
| `rodrigo@demo.ecosports.app` | `rodrigo123` | `parent_guardian` | Gerencia Enrico (via `managedAthleteIds`) |

`MockUser` tem `managedAthleteIds?: string[]` para o mapping domain de guardians. Mesmo padrão do `athleteId` — vive no mock, não no JWT.

Quando for adicionar personas futuras (`professional`, `org_admin`, `sponsor`, `platform_admin`), adicione mock users correspondentes **no mesmo commit** da tela deles, não antes.

## Trocando por provider real — checklist

Quando chegar a hora de ir pra Keycloak/Auth.js/Clerk/Auth0/Supabase:

1. **`lib/auth/session.ts`**: substituir `encrypt`/`decrypt`/`createSession`/`getSession`/`deleteSession` pelos equivalentes do provider. O shape `SessionPayload` permanece.
2. **`lib/auth/mock-users.ts`**: substituir `findMockUserByCredentials` e `findMockUserById` por queries em banco. O tipo `MockUser` vira `User` sem o campo `password`.
3. **`lib/auth/actions.ts`**: o `signIn` deixa de validar senha localmente; delega pro provider e só chama `createSession` após sucesso. Shape `SignInFormState` permanece (exceto mensagens de erro, que o provider pode ter seus próprios códigos).
4. **`lib/auth/dal.ts`**: **não muda**. É justamente o ponto do design.
5. **`proxy.ts`**: **não muda** (já lê via `decrypt` abstrato).
6. **UI (`(auth)/login`, `(app)/*`)**: **não muda**.

Se uma mudança futura força alterações fora de `lib/auth/`, é sinal de que a abstração vazou e precisa ser refeita antes de continuar.

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

### `SESSION_SECRET`

Vive em `web/.env.local` (gitignored). A função `getEncodedKey()` lança erro se a env var não está definida. **Isso é intencional** — melhor falhar loud no primeiro request do que assinar com string vazia.

```
# web/.env.local
SESSION_SECRET=dev-secret-change-me-in-prod-0123456789abcdef
```

Em produção/staging, trocar por secret forte gerenciado pelo provider de infra. Para desenvolvimento local, o valor é irrelevante desde que exista.

## Anti-patterns específicos do domínio

- **Não leia `cookies()` direto** fora de `session.ts`. Se você precisa da sessão noutro lugar, importe do DAL.
- **Não coloque dados do domínio no JWT** (athleteId, managed relationships, etc). Claims são puras.
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
