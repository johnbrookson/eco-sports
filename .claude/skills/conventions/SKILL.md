---
name: conventions
description: Use when starting any non-trivial work in the Eco-Sports codebase. Establishes the cross-cutting patterns (in-memory mutation, revalidatePath, React cache, Zod discriminated unions, DAL-authoritative authz, semantic tokens, commit format, Next.js 16 breaking changes) that every module follows. Invoke at the start of a session before touching any feature-specific skill.
---

> **Manutenção desta skill**: última revisão refletindo o estado até a implementação da persona `parent_guardian` (guardian dashboard, approval flow, cookie de persona, `requireGuardianOf`). Se você está lendo isto e acabou de fazer mudanças estruturais nas convenções do projeto (novo padrão cross-cutting, nova dependência de infra, nova regra de commits), atualize esta skill **no mesmo commit** ou commit imediatamente adjacente. Ver `git log -- .claude/skills/conventions/` para histórico.

# Convenções cross-cutting do Eco-Sports

Este é o baseline comum que atravessa todos os módulos. Skills específicas de módulo (`athlete-profile`, `auth-stub`, `performance-metrics`, `design-system`) assumem que você já leu isto.

## Imperativo (30 segundos)

- **Mutação in-memory é intencional e deliberada.** Todos os Server Actions mutam fixtures mock em-processo. **Nunca** escreva em `/tmp`, arquivo JSON, ou banco enquanto estamos na fase stub. Sobrevive até o restart do dev server, reseta depois — e está certo assim.
- **Sempre `revalidatePath` após mutação.** Toda Server Action que muta estado deve invalidar as páginas que leem esse estado. Exemplos: `saveProfile` invalida `/atleta/[slug]` (antigo e novo slug), `/atletas` e `/app/perfil`; `addPerformanceEvent` invalida `/app/performance`.
- **Sempre `React cache()` em fetchers.** Todo helper em `lib/*/get-*.ts` deve ser memoizado via `cache()`. Isso garante que `generateMetadata`, Server Components e Server Actions na mesma request não dupliquem trabalho.
- **DAL autoritativa em tudo que toca `(app)/*`.** O `proxy.ts` é só a primeira camada. **Toda** Server Component e **toda** Server Action que lê/muta dado sensível deve chamar `getCurrentUser()`, `getCurrentAthlete()` ou `verifySession()` do `lib/auth/dal.ts` antes de tocar o dado.
- **Zod em toda Server Action.** Toda mutação passa por `safeParse` com mensagem de erro amigável em pt-BR. Use `z.discriminatedUnion` quando a action aceita variantes (não "tudo opcional").
- **Tokens semânticos — nunca cor hardcoded nova.** Qualquer cor nova vira token em `globals.css` nos 4 blocos de tema (indigo light/dark, basketball light/dark) + registrada em `@theme inline`. Ver skill `design-system`.
- **Types alinhados a schemas.** Todo arquivo em `web/src/types/*.ts` começa com `// fonte: schemas/<arquivo>.json`. Futuro: gerar via `json-schema-to-typescript`.
- **Idiomas.** Docs, UI e comentários em **pt-BR**. Schemas, código, identificadores em **en**.
- **Next.js 16 tem breaking changes.** `middleware.ts` virou `proxy.ts`, `params`/`searchParams` são `Promise<...>`, `PageProps<'/rota'>` é global gerado por `next typegen`, `cookies()` é async. **Antes de escrever qualquer código Next.js, leia** `web/node_modules/next/dist/docs/01-app/` — especialmente `authentication.md`, `data-security.md`, `proxy.md`, `route-groups.md`, `layouts-and-pages.md`.
- **Commits conventional + granulares.** Um commit por mudança lógica, com HEREDOC no message e Co-Authored-By no final (ver seção "Commits" abaixo). Evite "commit everything".

## Padrões narrativos

### Mutação in-memory — por que e como

O backend real ainda não existe. Durante a fase stub, cada mock (`mockAthletes`, `mockPerformanceEvents`, `mockUsers`) vive como um array mutável no módulo, e Server Actions mutam direto:

```ts
// web/src/lib/mock/get-performance.ts
export function pushPerformanceEvent(event: PerformanceEvent): void {
  mockPerformanceEvents.push(event);
}
```

Por que in-memory e não JSON em /tmp ou SQLite?

1. **Substituível sem arquitetura intermediária.** Quando o backend real chegar (Go ou Node monólito modular + PostgreSQL), a substituição é literalmente "trocar o corpo do helper por um query". Nenhuma camada de I/O de arquivo precisa ser desmontada.
2. **Zero config.** Não precisa de locks, de schema migration, de cleanup de test data. O reset a cada restart é uma **feature** — garante que o dev server sempre volta a um estado conhecido.
3. **O padrão de invalidação (`revalidatePath`) já é o que o backend real vai usar.** A gente está treinando o músculo certo desde o stub.

**Anti-pattern a evitar:** não crie um "seed loader" que lê de JSON na inicialização pra parecer "mais real". Isso é complexidade que vai ser jogada fora.

### `revalidatePath` — o que invalidar quando

Toda mutação deve invalidar todas as páginas que derivam daquele dado. Tabela rápida:

| Tipo de mutação | Paths a invalidar |
|---|---|
| `saveProfile` (editor do atleta) | `/atleta/<slugAntigo>`, `/atleta/<slugNovo>` se mudou, `/atletas`, `/app/perfil` |
| `addPerformanceEvent` | `/app/performance` |
| `signIn` / `signOut` | Não precisa — `createSession` já redireciona |
| `resolveVisibilityApproval` (guardian aprova/rejeita) | `/app/aprovacoes`, `/app/atletas/<id>`, `/app`, `/atleta/<slug>`, `/atletas` |
| Futuras: `consent`, etc | Incluir `/app/consentimentos`, `/app/perfil`, e perfil público afetado |

**Anti-pattern:** não chame `revalidatePath("/")` ou `revalidatePath("/app")` — são amplos demais e invalidam caches que não mudaram. Seja específico.

### React `cache()` em fetchers

Todo helper que lê dado mock deve ser envolvido em `cache()` do React, não do Next:

```ts
import { cache } from "react";

export const getPublicAthleteBySlug = cache(async (slug: string) => { ... });
```

Isso memoiza dentro de uma request. Se `generateMetadata` e o componente da mesma página chamam, roda só uma vez.

**Helper de mutação NÃO é cached** — `pushPerformanceEvent` e `updateAthleteById` são funções síncronas normais, não envolvidas em `cache()`, porque cache é só pra leitura.

### DAL autoritativa

O `proxy.ts` em `src/proxy.ts` faz **optimistic check** — se não tem cookie válido, redireciona pra `/login`. Isso é primeira linha, não suficiente.

A **segunda linha (autoritativa)** vive em `src/lib/auth/dal.ts`:

```ts
// toda Server Component em (app)/*
const athlete = await getCurrentAthlete();

// toda Server Action que muta dado do atleta
const current = await getCurrentAthlete();
```

**Por quê duas linhas?** O proxy pode ser burlado (bug do Next, cache stale, caminho não coberto pelo matcher). O DAL vive junto do dado e não tem como ser burlado sem reescrever a função. É a recomendação explícita do `web/node_modules/next/dist/docs/01-app/02-guides/data-security.md` — a única resposta correta é "authorize close to the data".

O mesmo padrão se aplica para autorização de guardian: `requireGuardianOf(athleteId)` em `dal.ts` verifica que o user autenticado é guardian ativo do atleta indicado. Redireciona para `/app` se não for. Retorna `GuardianRelationship` para que o caller possa checar `legallyResponsible`.

**Anti-pattern:** não leia `cookies()` direto num Server Component de `(app)/*`. Chame o DAL. Se precisa de uma variação do DAL, adicione método novo ao `dal.ts`, não contorne ele.

### Cookie `eco-sports-persona` — persona switcher

Cookie não-HttpOnly que rastreia qual role está ativo no shell (ex: `athlete`, `parent_guardian`). Setado pelo `signIn` com `roles[0]` do user e atualizado pelo persona switcher via `document.cookie`. Limpo no `signOut`.

Lido no server por `getCurrentPersona()` em `dal.ts`, que valida o valor do cookie contra as roles reais do user (fallback pra `roles[0]` se inválido). **Não é sensível** — saber a role sem sessão válida é inútil.

Usado pelo layout, dashboard e sidebar pra renderizar conteúdo específico por persona.

### Zod discriminated unions

Quando uma Server Action aceita variantes com campos diferentes, use `discriminatedUnion` em vez de "tudo opcional":

```ts
const MatchEventSchema = z.object({
  sourceType: z.literal("match"),
  points: z.coerce.number().min(0),
  assists: z.coerce.number().min(0),
  // ...
});

const AssessmentEventSchema = z.object({
  sourceType: z.literal("assessment"),
  verticalJumpCm: z.coerce.number().min(0).optional(),
  // ...
});

const CreateEventSchema = z.discriminatedUnion("sourceType", [
  MatchEventSchema,
  AssessmentEventSchema,
]);
```

Vantagem sobre "tudo opcional": TypeScript infere o tipo específico pós-validação, e o erro de validação aponta a variante errada especificamente. Exemplo funcional em `web/src/lib/performance/actions.ts`.

### Error API do Zod 4

Nossa versão é zod 4.x. A API de flatten mudou: use `z.flattenError(parsed.error).fieldErrors`, **não** `parsed.error.flatten().fieldErrors` (que é zod 3 deprecated).

### Types a partir de schemas JSON

Convenção: todo arquivo em `web/src/types/*.ts` começa com um comentário:

```ts
// fonte: schemas/athlete.json
// Mantenha alinhado com o JSON Schema em `schemas/athlete.json`.
// Futuro: gerar automaticamente via json-schema-to-typescript.
```

Ao mudar um schema, você **deve** atualizar o type correspondente no mesmo commit (ou commit adjacente com referência ao commit do schema).

## Commits

Formato conventional:

- `feat(web): ...` — features no web/
- `fix(web): ...` — bugs
- `refactor(web): ...` — refactor sem mudar comportamento
- `chore(web): ...` — deps, config, infra
- `docs: ...` — docs/ e CLAUDE.md (sem scope quando cross-project)
- `refactor(schema): ...` — mudanças em schemas/

Regras:

- **Granular.** Um commit por mudança lógica. Um commit com 8 arquivos em 4 categorias diferentes é bug, não feature.
- **HEREDOC no message.** Sempre usar `git commit -m "$(cat <<'EOF' ... EOF )"` pra preservar formatação.
- **Co-Authored-By no final.** `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
- **Never add without naming files.** Nunca `git add -A` ou `git add .`. Sempre stage por nome pra evitar pegar o Grupo C untracked sem querer.

## Grupo C — resolvido

Os 8 arquivos que estavam untracked (schemas, docs/actors-permissoes.md, .gitignore) foram todos comitados durante a implementação das personas `athlete` e `parent_guardian`. A restrição de "não tocar" não se aplica mais. Continue usando `git add` com nomes específicos por boa prática, mas não há mais arquivos untracked pré-existentes para proteger.

## Next.js 16 — armadilhas recorrentes

- `middleware.ts` → `proxy.ts`. Função exportada se chama `proxy`, não `middleware`.
- `params` e `searchParams` em pages/layouts são `Promise<{...}>`. Sempre `await`.
- `PageProps<'/rota/[slug]'>` e `LayoutProps<'/rota'>` são globais, geradas por `next typegen` — **mas só após `next dev`/`next build` rodar pelo menos uma vez** pra registrar rotas novas. Se rota nova ainda não foi tipada, use tipo inline: `{ params: Promise<{ slug: string }> }`.
- `cookies()` do `next/headers` é async. `const cookieStore = await cookies();`.
- Route groups `(nome)` continuam funcionando. Não aparecem na URL. Nested layout dentro de route group herda o root layout.
- `generateStaticParams` + `dynamicParams: true` (default) = SSG nos slugs conhecidos + renderização on-demand nos desconhecidos.

## Para profundidade, ler

- [docs/saas-plano-inicial.md](../../../docs/saas-plano-inicial.md) — estado atual, estrutura de route groups, convenções narrativas
- [CLAUDE.md](../../../CLAUDE.md) — índice de skills + estrutura de pastas
- [web/AGENTS.md](../../../web/AGENTS.md) — aviso sobre Next.js 16 breaking changes
- [web/node_modules/next/dist/docs/01-app/](../../../web/node_modules/next/dist/docs/01-app/) — docs bundled do Next.js 16 (fonte autoritativa para dúvidas do framework)

Skills de domínio (invocar depois desta):

- `athlete-profile` — perfil editável, perfil público, vitrine, visibility
- `auth-stub` — session, DAL, proxy, login
- `performance-metrics` — histórico de eventos, gráficos, discriminated union
- `design-system` — tokens, temas, SiteNav, profile-surface
