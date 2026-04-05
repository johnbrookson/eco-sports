# CLAUDE.md

Guia para Claude Code (claude.ai/code) trabalhando neste repositório.

## Sobre o projeto

**Eco-Sports** é uma plataforma de gestão de carreira e desenvolvimento de atletas, parte do ecossistema Ceronify. Nicho inicial: **basketball em categorias de base**. Este repo contém docs de arquitetura, JSON Schemas do domínio, diagramas e a aplicação web em Next.js 16.

## Estrutura de alto nível

```
.claude/skills/         Skills especialistas por módulo (invocar antes de mexer no módulo)
docs/                   Documentação narrativa (arquitetura, plano, atores, stakeholders)
schemas/                JSON Schemas canônicos das entidades do domínio
diagrams/               platform-architecture.drawio
web/                    Aplicação Next.js 16 (frontend + auth stub + SaaS área autenticada)
```

Organização interna de `web/src/` e listagem detalhada de rotas, fixtures, Server Actions, etc vive nas skills de cada módulo (ver abaixo).

## Skills disponíveis

Este projeto usa **skills especialistas** em `.claude/skills/`. Cada uma cobre um módulo ou contexto delimitado com imperativo de 30 segundos + padrões narrativos + anti-patterns + referências. **Invoque a skill relevante antes de começar trabalho num módulo** — evita reinferir decisões já tomadas.

| Skill | Invoque quando for mexer em… |
|---|---|
| [`conventions`](.claude/skills/conventions/SKILL.md) | Qualquer trabalho não-trivial. Cobre padrões cross-cutting: mutação in-memory, revalidatePath, React cache(), Zod discriminated unions, DAL autoritativa, tokens semânticos, commits conventional, armadilhas do Next.js 16. **Leia esta primeiro em cada sessão nova.** |
| [`athlete-profile`](.claude/skills/athlete-profile/SKILL.md) | Schema `athlete.json`, visibility (dual switch + granulares), editor `/app/perfil`, perfil público `/atleta/[slug]`, vitrine `/atletas`, LGPD pra menores |
| [`auth-stub`](.claude/skills/auth-stub/SKILL.md) | `lib/auth/*`, `proxy.ts`, login, DAL, contrato OIDC-like, planejamento da troca por provider real |
| [`performance-metrics`](.claude/skills/performance-metrics/SKILL.md) | Schema `performance-metrics.json`, `/app/performance`, gráficos recharts, Zod discriminated union por tipo de evento |
| [`design-system`](.claude/skills/design-system/SKILL.md) | Tokens oklch, temas (basketball, indigo), `--profile-surface`, `SiteNav` com 3 variantes, adição de token novo |

**Regra de ouro**: toda implementação ou decisão arquitetural não-trivial em um módulo deve atualizar a skill correspondente **no mesmo commit ou commit adjacente**. Skills que divergem do código viram mentira.

## Comandos

```bash
cd web
npm run dev      # dev server (Turbopack)
npm run build    # build de produção
npm run lint     # ESLint
node_modules/.bin/tsc --noEmit  # type-check sem build
```

## Next.js 16 — aviso crítico

**Esta versão tem breaking changes vs conhecimento de treinamento de LLMs.** `middleware.ts` virou `proxy.ts`, `params`/`searchParams` são `Promise<...>`, `cookies()` é async, `PageProps<'/rota'>` é global gerado por `next typegen`. Antes de escrever código Next.js, consulte `web/node_modules/next/dist/docs/01-app/` — em especial `authentication.md`, `data-security.md`, `proxy.md`, `route-groups.md`, `layouts-and-pages.md`. O arquivo `web/AGENTS.md` reforça isso. Detalhes e armadilhas estão na skill `conventions`.

## Convenções gerais

- **Idioma**: docs, UI e comentários em **português brasileiro**; schemas, código, identificadores e git commit subjects em **inglês**.
- **Datas**: ISO 8601 com timezone. Ao mencionar datas relativas em memória/docs, converter pra absoluto ("Thursday" → "2026-03-05").
- **Schemas JSON**: `$schema` draft 2020-12, `$id` em `https://eco-sports.local/schemas/<nome>.json`, `additionalProperties: false` em todos os objetos, `camelCase` nos campos, `tenantId` obrigatório em entidades do domínio.
- **Grupo C intocado**: há arquivos untracked/modificados pré-existentes (`.gitignore`, vários `schemas/*.json`, `docs/actors-permissoes.md`) que não devem ser comitados sem autorização explícita. Stage sempre arquivos específicos por nome. Detalhes na skill `conventions`.

Para contexto histórico, plano de implementação narrativo, modelo de negócio e roadmap, ler [docs/saas-plano-inicial.md](docs/saas-plano-inicial.md) e demais arquivos em [docs/](docs/). Essas informações deliberadamente não vivem neste arquivo pra manter o CLAUDE.md leve — documentos narrativos são carregados sob demanda via `Read` quando necessário.
