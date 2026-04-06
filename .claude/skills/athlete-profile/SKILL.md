---
name: athlete-profile
description: Use when modifying anything related to the athlete profile domain — the schema `athlete.json`, the visibility model (publicProfileEnabled, discoverable, granular flags), the editable profile at /app/perfil, the public profile at /atleta/[slug], the public directory at /atletas, or the not-found fallback. Covers LGPD considerations for minor athletes and the dual-channel visibility pattern (direct link vs searchable directory).
---

> **Manutenção desta skill**: última revisão refletindo o estado da persona `parent_guardian` v1 (pendingVisibility, fluxo de aprovação, páginas do guardian). Se você está lendo isto e acabou de fazer mudanças no domínio athlete (schema, editor, perfil público, vitrine, visibility, helpers de mock), atualize esta skill **no mesmo commit** ou commit adjacente. Ver `git log -- .claude/skills/athlete-profile/` para histórico com hashes.

# Athlete profile — visibility, editor, perfil público e vitrine

Domínio central da plataforma: o atleta é o ator gravitacional. Toda persona futura (parent_guardian, coach, scout, org_admin) vai consumir ou alimentar dados do schema de atleta. Mudanças aqui têm impacto amplo.

## Imperativo (30 segundos)

- **Leia a skill `conventions` primeiro** se ainda não leu nesta conversa.
- **Visibility tem DOIS switches independentes**: `publicProfileEnabled` (link direto em `/atleta/[slug]`) e `discoverable` (listagem pública em `/atletas`). Nunca ligue um automaticamente quando o outro muda. **Não são sinônimos.**
- **Para atletas menores de idade (`minorConsentProvided`), `discoverable` deve ser opt-in explícito do responsável.** Essa é a regra de LGPD mais importante do domínio. O editor hoje já alerta via copy, mas a validação rigorosa (bloquear até guardian aprovar) só vem na fase `parent_guardian`.
- **`slug` é editável pelo atleta e único por tenant.** `saveProfile` valida unicidade via `isSlugAvailableForAthlete(slug, tenantId, currentAthleteId)` antes de mutar — a função exclui o próprio atleta, então manter o slug atual não dispara erro. Colisão retorna field error em `slug` com mensagem amigável em pt-BR.
- **`profile.bio` vive dentro de `athlete.profile`, NÃO num mapa separado.** Houve um refactor histórico que moveu `mockAthleteBios` pra `athlete.profile.bio` — não reverte isso criando outro mapa.
- **Ao mutar o atleta, invalide 3-4 paths**: `/atleta/<slugAntigo>`, `/atleta/<slugNovo>` (se mudou), `/atletas`, `/app/perfil`. O `saveProfile` já faz isso — siga o padrão ao criar novas mutações.
- **Card da vitrine é deliberadamente minimalista**: foto (se `showPhoto`), nome, posição, categoria, clube (se `showCurrentClub`). **Não expanda.** Idade, cidade, bio, contato e métricas só aparecem no perfil individual, onde as flags granulares aplicam.

## Modelo de visibility — o mais importante entender

Dois canais ortogonais:

```
┌─────────────────────────────────┐
│ publicProfileEnabled (true)     │  → /atleta/[slug] retorna 200
│                                 │    • Link direto funciona
│                                 │    • Compartilhamento via WhatsApp/e-mail
│                                 │    • Atleta controla distribuição
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ discoverable (true)             │  → /atletas lista o atleta
│ (requer publicProfileEnabled)   │    • Busca pública funciona
│                                 │    • Qualquer visitante encontra
│                                 │    • Atleta NÃO controla quem acha
└─────────────────────────────────┘
```

Por que separar? Muitos atletas (especialmente menores) querem ter um link compartilhável pra enviar pra scouts específicos, mas **não** querem que qualquer visitante da internet os encontre por busca. A separação respeita isso como opt-in explícito.

Flags granulares (aplicam só no perfil individual, **não** no card da vitrine):

| Flag | Controla |
|---|---|
| `showPhoto` | Foto do atleta no hero e no card da vitrine |
| `showAge` | Idade calculada da `birthDate` no hero |
| `showCity` | Cidade + estado no hero |
| `showPhysicalProfile` | Seção "Ficha Física" (altura, peso, envergadura) |
| `showHighlightVideos` | Embed do vídeo de destaque |
| `showAchievements` | Lista numerada de conquistas |
| `showCurrentClub` | Badge de clube no hero, nome do clube no card da vitrine |
| `showContact` | Seção de contato (email, phone, instagram, linkedin) |
| `showMatchStats` | Seção "Performance" — stat cards de partidas (médias últimas 5) com delta e trend badge |
| `showAssessmentStats` | Seção "Performance" — stat cards de avaliações físicas (última medição) com delta |

**Defaults restritivos**: todas começam `false`. O atleta opta por expor.

## Arquivos-chave

### Schema e types

- [schemas/athlete.json](../../../schemas/athlete.json) — schema canônico. Required: `id`, `tenantId`, `profile`, `sport`, `category`, `status`, `consents`, `visibility`, `createdAt`, `updatedAt`. Mudanças aqui são contrato com todas as personas futuras.
- [web/src/types/athlete.ts](../../../web/src/types/athlete.ts) — types TS alinhados ao schema. Tem `// fonte:` no topo.

### Mocks

- [web/src/lib/mock/athletes.ts](../../../web/src/lib/mock/athletes.ts) — 2 atletas completos:
  - **João Silva** (`joao-silva-2008`): armador sub-17 do Paulistano, menor de idade, `publicProfileEnabled=true` + `discoverable=false` (exemplo conservador)
  - **Mariana Costa** (`mariana-costa-2007`): ala-pivô sub-18 do Fluminense, maior de idade, ambas as flags `true` (exemplo aberto)
  - Array mutado in-place por `saveProfile`
- [web/src/lib/mock/get-athlete.ts](../../../web/src/lib/mock/get-athlete.ts) — helpers:
  - `getPublicAthleteBySlug(slug)` — respeita `publicProfileEnabled`, retorna `null` se desabilitado (dispara 404)
  - `getAthleteById(id)` — busca interna, não filtra visibility
  - `isSlugAvailableForAthlete(slug, tenantId, currentAthleteId)` — check de unicidade escopado por tenant, exclui o próprio atleta. Memoizado via `cache()`. Quando o backend real existir, vira query com UNIQUE constraint no banco — assinatura mantida.
  - `listPublicAthleteSlugs()` — usado em `generateStaticParams`
  - `updateAthleteById(id, updater)` — mutação in-place, atualiza `updatedAt`
- [web/src/lib/mock/search-athletes.ts](../../../web/src/lib/mock/search-athletes.ts) — vitrine:
  - `searchDiscoverableAthletes({ q, position, category })` — filtra por `publicProfileEnabled && discoverable`, busca textual em nome/slug, filtro por posição/categoria
  - `listDirectoryFacets()` — valores distintos para alimentar os selects de filtro (só do subset discoverable — sem opções que nunca retornariam resultado)

### Server Action

- [web/src/lib/profile/actions.ts](../../../web/src/lib/profile/actions.ts) — `saveProfile`:
  - Autorização via `getCurrentAthlete()` (DAL)
  - Schema Zod cobrindo 26+ campos (identidade, sport, físico, carreira, mídia, contato, visibility)
  - **Check de unicidade de slug** via `isSlugAvailableForAthlete` antes da mutação. Colisão → early return com field error em `slug`.
  - Mutação via `updateAthleteById`
  - `revalidatePath` em `/atleta/<antigo>`, `/atleta/<novo>` (se mudou), `/atletas`, `/app/perfil`

### Páginas

- [web/src/app/(profile)/layout.tsx](../../../web/src/app/(profile)/layout.tsx) — layout minimalista do perfil público (header absoluto transparente + footer discreto). Vive no grupo `(profile)` que é separado de `(marketing)` e `(app)`.
- [web/src/app/(profile)/atleta/[slug]/page.tsx](../../../web/src/app/(profile)/atleta/[slug]/page.tsx) — perfil público sport-magazine. `generateStaticParams` pra SSG + `dynamicParams: true` pra slugs desconhecidos caírem no 404 customizado. Lê `athlete.profile.bio` direto (não de um mapa externo).
- [web/src/app/(profile)/atleta/[slug]/not-found.tsx](../../../web/src/app/(profile)/atleta/[slug]/not-found.tsx) — 404 no mesmo visual editorial. Cobre **tanto slug inexistente quanto `publicProfileEnabled=false`** — do ponto de vista do visitante, indistinguível (privacidade).
- [web/src/app/atletas/page.tsx](../../../web/src/app/atletas/page.tsx) — vitrine pública. Server Component puro (filtros em searchParams, GET form, zero client JS no core). Dois empty states: "nenhum resultado" (com fallback "em destaque") e "vitrine vazia" (quando nenhum atleta é discoverable).
- [web/src/components/athlete-directory-card.tsx](../../../web/src/components/athlete-directory-card.tsx) — card da vitrine, deliberadamente minimalista.
- [web/src/app/(app)/app/perfil/page.tsx](../../../web/src/app/(app)/app/perfil/page.tsx) — editor. Server Component que busca via DAL.
- [web/src/app/(app)/app/perfil/profile-form.tsx](../../../web/src/app/(app)/app/perfil/profile-form.tsx) — form client. 7 seções (Identidade, Esporte, Ficha Física, Carreira, Mídia, Contato, Privacidade granular) + master card `PublicVisibilityCard` com os dois switches no topo.

## Padrões estabelecidos

### Master vs granulares no editor

O `PublicVisibilityCard` no topo do form é **deliberadamente visualmente destacado** (borda 2px primary, bg primary/5) porque as duas flags master (`publicProfileEnabled` + `discoverable`) são decisões de primeiro nível. As flags granulares vivem em `InlineToggle` dentro de cada seção que elas controlam, ou numa seção final "Privacidade granular" pros toggles que não têm seção natural (`showPhoto`, `showAge`, `showCity`).

**Anti-pattern**: uma "aba de Privacidade" com todos os toggles juntos. Testado mentalmente e rejeitado — vira tela esquecida.

### Slug — regex, validação e unicidade

Pattern canônico no schema e no Zod: `^[a-z0-9][a-z0-9-]{2,59}$`

Letras minúsculas, dígitos e hífens. Min 3, max 60, começa com alfanumérico. Decisão: bloqueia acentos e maiúsculas intencionalmente (URLs limpas e portáveis). O editor hoje aceita o usuário digitar diretamente — **futuro**: transliteração automática do nome ("João Silva 2008" → "joao-silva-2008") como helper.

**Unicidade** é escopada por `tenantId` (por convenção do schema). O check vive em `isSlugAvailableForAthlete(slug, tenantId, currentAthleteId)` em `lib/mock/get-athlete.ts`, memoizado via `cache()`. Quando o backend real existir, a função vira uma query com UNIQUE constraint composto `(tenantId, slug)` no banco — a assinatura em código permanece igual.

O check é feito no `saveProfile` **depois** do Zod parse (que valida formato) e **antes** da mutação (que grava). A ordem importa: Zod garante que o slug é sintaticamente válido; a unicidade é semântica e depende do estado global do tenant. `excludeAthleteId = current.id` garante que manter o slug atual não dispara erro — decisão importante porque senão o atleta editaria outros campos e seria bloqueado por colidir consigo mesmo.

### Bio no schema, não em mapa externo

Houve um refactor histórico (commit `1cc0af2`) que moveu a bio de um mapa separado (`mockAthleteBios: Record<slug, string>`) para dentro de `athlete.profile.bio`. Razão: permitir edição pelo atleta sem criar uma segunda surface de mutação. Quando alguém perguntar "por que bio é opcional no schema se toda tela usa?", a resposta é "backwards compat com atletas que ainda não escreveram bio, e o perfil público faz fallback pra descrição genérica".

### LGPD e menores — o que está e o que falta

**Implementado:**
- Schema tem `consents.minorConsentProvided`
- Copy do editor avisa que `discoverable` deve ficar desligado pra menores
- Guardiões existem como array em `athlete.guardians` (nome, relationship, phone, email)
- **Aprovação do guardian para menores** — `saveProfile` checa `isMinorAthlete()` e redireciona mudanças em `publicProfileEnabled`, `discoverable`, `showMatchStats`, `showAssessmentStats` para `pendingVisibility` em vez de aplicar direto
- **Painel do guardian** — `/app/aprovacoes` lista mudanças pendentes, guardian pode aprovar/rejeitar via `resolveVisibilityApproval`
- **Detail do atleta** — `/app/atletas/[id]` mostra perfil + performance + visibility em read-only, autorizado via `requireGuardianOf`
- Schema `guardian-relationship.json` consumido via `GuardianRelationship` type + mock

**Não implementado (vem no consent flow LGPD):**
- Versionamento de consentimento (`consentVersion`, fluxo de re-consent quando version muda)
- Schema `consent.json` — existe tracked mas não consumido ainda. Substitui o `pendingVisibility` leve por `Consent` entities com cadeia de versões, evidências, escopo

### Card da vitrine — subset DO QUE aparece

Expondo propositalmente:
- `showPhoto` ? `photoUrl` : iniciais
- `firstName` + `lastName` sempre (se descobrível)
- `primaryPosition` sempre
- `category` sempre
- `showCurrentClub` ? `career.currentClub` : "Ver perfil completo"

**NÃO expondo mesmo que as flags estejam true:**
- idade (`birthDate`)
- `city` / `state`
- `bio`
- contato
- stats físicas

Justificativa: a listagem é prévia, não o perfil. Detalhes moram no `/atleta/[slug]` individual.

## pendingVisibility — fluxo de aprovação para menores

Tipo `PendingVisibilityChange` em `types/athlete.ts`: `{ changes: Partial<AthleteVisibility>, requestedAt: string, requestedBy: string }`.

**4 flags requerem aprovação do guardian para atletas menores:**
- `publicProfileEnabled`, `discoverable`, `showMatchStats`, `showAssessmentStats`

**Demais flags** (`showPhoto`, `showAge`, `showCity`, etc.) aplicam imediatamente mesmo para menores.

**Fluxo:**
1. Atleta menor altera flag crítica via `saveProfile`
2. `isMinorAthlete()` (derivado de `birthDate`) detecta que é menor
3. Mudança vai para `athlete.pendingVisibility` em vez de `visibility`
4. `saveProfile` retorna mensagem indicando envio para aprovação
5. Guardian vê em `/app/aprovacoes` e aprova/rejeita via `resolveVisibilityApproval`
6. Aprovação: merge `pendingVisibility.changes` → `visibility`, limpa pending
7. Rejeição: limpa pending

`resolveVisibilityApproval` (em `lib/guardian/actions.ts`) checa `requireGuardianOf(athleteId)` + `legallyResponsible === true`. `revalidatePath` cobre: `/app/aprovacoes`, `/app/atletas/<id>`, `/app`, `/atleta/<slug>`, `/atletas`.

### Guardian integration — arquivos

- [web/src/lib/guardian/actions.ts](../../../web/src/lib/guardian/actions.ts) — Server Action `resolveVisibilityApproval`
- [web/src/lib/mock/guardian-relationships.ts](../../../web/src/lib/mock/guardian-relationships.ts) — mock relationships + helpers memoizados
- [web/src/types/guardian-relationship.ts](../../../web/src/types/guardian-relationship.ts) — type alinhado ao schema
- [web/src/app/(app)/app/atletas/page.tsx](../../../web/src/app/(app)/app/atletas/page.tsx) — lista de atletas supervisionados
- [web/src/app/(app)/app/atletas/[id]/page.tsx](../../../web/src/app/(app)/app/atletas/[id]/page.tsx) — detail read-only
- [web/src/app/(app)/app/aprovacoes/page.tsx](../../../web/src/app/(app)/app/aprovacoes/page.tsx) — pendências
- [web/src/app/(app)/app/aprovacoes/approval-card.tsx](../../../web/src/app/(app)/app/aprovacoes/approval-card.tsx) — card client com `useActionState`

## Anti-patterns específicos do domínio

- **Não ligar `discoverable` automaticamente quando `publicProfileEnabled` muda pra `true`.** São decisões independentes.
- **Não expor dados granulares no card da vitrine** mesmo que as flags estejam true. Card é teaser.
- **Não criar um segundo local pra bio** (ex: mapa externo, tabela separada). Bio vive em `profile.bio`.
- **Não usar `generateStaticParams` sem `dynamicParams: true`** para `/atleta/[slug]` — slugs desconhecidos precisam chegar ao `notFound()` do page.tsx pra acionar o not-found customizado.
- **Não ler `cookies()` direto** em nenhum componente do domínio — sempre via DAL.
- **Não revalidar apenas o slug novo** quando o atleta renomeia. Revalide o antigo também (se não, `/atleta/<antigo>` vai ficar em cache servindo dado stale).

## Para profundidade, ler

- [docs/saas-plano-inicial.md](../../../docs/saas-plano-inicial.md) — seção "Estado atual" > "Público / Marketing" para o histórico da decisão de visibility
- [schemas/athlete.json](../../../schemas/athlete.json) — fonte canônica do modelo de dados
- [docs/actors-permissoes.md](../../../docs/actors-permissoes.md) (se/quando existir — hoje está untracked no Grupo C) — matriz de permissões entre personas
- Skill `auth-stub` — se você precisa entender como o editor chega ao atleta correto via DAL
- Skill `design-system` — se você está mexendo no visual do card da vitrine ou do hero do perfil público
