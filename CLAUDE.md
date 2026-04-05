# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sobre o projeto

Eco-Sports é uma plataforma para **gestão completa de carreira e desenvolvimento de atletas**, parte do ecossistema Ceronify. O nicho inicial é **basketball em categorias de base**. O repositório contém documentação de arquitetura, schemas de dados e a **aplicação web** (Next.js).

## Estrutura do repositório

- `web/` — aplicação Next.js (frontend)
  - `src/app/` — rotas da aplicação
    - Marketing público (flat, sem route group ainda): `/`, `/para-quem`, `/ferramentas`, `/ecossistema`, `/blog`, `/design-system`
    - Perfil público do atleta no route group `(profile)`: `/atleta/[slug]` (sport-magazine style, respeita `visibility` do schema; `not-found.tsx` customizado)
  - `src/components/ui/` — componentes shadcn/ui customizados
  - `src/components/` — componentes do projeto (theme-switcher)
  - `src/lib/` — utilitários (`utils.ts`, `blog-data.ts`, `mock/` fixtures de atletas)
  - `src/types/` — types TypeScript alinhados aos JSON Schemas de `schemas/`
- `docs/` — documentação de arquitetura, modelo de negócio, roadmap e framework operacional
  - Arquivos `01-` a `04-` são versões expandidas e detalhadas
  - `arquitetura.md`, `modelo-negocio.md`, `roadmap.md` são versões resumidas
  - `actors-permissoes.md` — atores do SaaS, papéis (RBAC) e matriz de permissões
  - `dores-stakeholders.md` — dores e jornadas dos stakeholders
- `schemas/` — JSON Schemas base para entidades do domínio
  - Domínio atleta: `athlete` (inclui bloco `visibility` para controlar o perfil público e `slug` para a rota `/atleta/[slug]`), `performance-metrics`
  - Identity & Access: `user`, `tenant`, `organization-membership`, `guardian-relationship`
  - Legal & Compliance: `consent`, `service-contract`
  - Taxonomia: `servicos-taxonomia`
- `diagrams/` — diagrama Draw.io da arquitetura macro (`platform-architecture.drawio`)

## Arquitetura da plataforma

### Domínios principais (11)

Identity & Access | Athlete Profile | Career Management | Performance & Analytics | Video Analysis | Training Programs | Portfolio & Branding | Legal & Compliance | Sponsorship & Funding | Wellbeing & Education | Communication & CRM

### Stack técnica

- **Frontend (web)**: Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Design System**: Dois temas configuráveis via `data-theme` (indigo e basketball)
- **Fonte**: Inter (Google Fonts)
- **Ícones**: Lucide React
- **Mobile** (futuro): React Native ou Flutter
- **Backend** (futuro): Go ou Node.js (monólito modular inicialmente)
- **Banco** (futuro): PostgreSQL + S3-compatible (storage) + Redis (cache/filas)
- **Event Bus** (futuro): NATS ou RabbitMQ
- **Auth** (futuro): Keycloak, Clerk ou Auth0
- **Observabilidade** (futuro): OpenTelemetry + Grafana

### Design System

- Tokens semânticos em CSS custom properties (oklch)
- Dois temas: `indigo` (azul/violet) e `basketball` (laranja/navy — nicho inicial)
- Alternância via atributo `data-theme` no `<html>` com persistência em localStorage
- Light e dark mode configurados para ambos os temas
- Componentes shadcn/ui instalados: Button, Input, Textarea, Card, Badge, Avatar, Dialog, Table, Select, Tabs, Separator, Tooltip
- Styleguide visual em `/design-system`
- Animações CSS: float (cards), pulse (badges), shimmer (texto), glow (botões)

### Comandos do projeto web

```bash
cd web
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção
npm run lint     # linting
```

### Princípios arquiteturais

- Design domain-driven com modularidade por domínio
- API-first (REST transacional + eventos assíncronos)
- Multi-tenant lógico desde o design (todo dado sensível carrega `tenantId`)
- Monólito modular primeiro; microserviços só quando operacionalmente necessário
- Segurança e consentimento por padrão (LGPD, consentimento de menor)
- Dois tipos de tenant: `individual` (pessoa física) e `organization` (clube, academia, projeto social, empresa)
- Atores globais (RBAC — ver `docs/actors-permissoes.md`):
  - `athlete`, `parent_guardian` (obrigatório no nicho de base), `professional` (com especialidade: coach, scout, psychologist, lawyer, physical_trainer, nutritionist, career_advisor, video_analyst), `sponsor`, `platform_admin`
- Papéis organizacionais (dentro de um tenant `organization`): `org_admin`, `org_manager`, `org_coach`, `org_scout`, `org_member`, `org_sponsor_manager`
- O dado é do atleta, não do clube — organizações têm acesso concedido, não propriedade
- Psicólogos têm isolamento clínico: conteúdo de sessões não é visível para clube, outros profissionais nem para platform_admin

## Modelo de negócio

Modelo híbrido: software + operação especializada (não é SaaS puro).

- **Receita recorrente**: Assinaturas mensais/anuais (tiers: Starter, Pro, Elite, Organization)
- **Serviços**: Consultoria de carreira, análise de vídeo, revisão de contratos, projetos de captação
- **Receita variável**: Setup fees, gestão de patrocínio, portfólios premium

## Roadmap

Fase 0 (Discovery) → Fase 1 (MVP Operacional) → Fase 2 (Produto Assistido) → Fase 3 (B2B Lite) → Fase 4 (Jurídico/Patrocínio/Lei de Incentivo) → Fase 5 (Analytics Avançado) → Fase 6 (Ecossistema/Marketplace)

## Convenções de dados

- Datas em ISO 8601 com timezone
- Schemas JSON usam `$schema: draft 2020-12` com `$id` em `https://eco-sports.local/schemas/<nome>.json`
- Convenção: `additionalProperties: false` em todos os objetos, `camelCase` nos campos, `tenantId` obrigatório em entidades do domínio
- Entidades auditáveis com versionamento (consents, contratos, planos) — consents não são atualizados; nova versão substitui a anterior via `supersedesConsentId`
- Métricas de performance vinculadas a contexto de origem (treino/jogo/avaliação/vídeo)
- Idioma dos documentos: **português brasileiro**; schemas e código em **inglês**
