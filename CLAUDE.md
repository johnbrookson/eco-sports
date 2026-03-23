# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sobre o projeto

Eco-Sports é uma plataforma para **gestão completa de carreira e desenvolvimento de atletas**, parte do ecossistema Ceronify. O nicho inicial é **basketball em categorias de base**. O repositório contém documentação de arquitetura, schemas de dados e a **aplicação web** (Next.js).

## Estrutura do repositório

- `web/` — aplicação Next.js (frontend)
  - `src/app/` — rotas da aplicação (landing page, design system, ferramentas, ecossistema, blog, para-quem)
  - `src/components/ui/` — componentes shadcn/ui customizados
  - `src/components/` — componentes do projeto (theme-switcher)
  - `src/lib/` — utilitários
- `docs/` — documentação de arquitetura, modelo de negócio, roadmap e framework operacional
  - Arquivos `01-` a `04-` são versões expandidas e detalhadas
  - `arquitetura.md`, `modelo-negocio.md`, `roadmap.md` são versões resumidas
- `schemas/` — JSON Schemas base para entidades do domínio (athlete, performance-metrics, servicos-taxonomia)
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
- RBAC por tipo de stakeholder (athlete, parent_guardian, coach, scout, club_manager, sponsor, psychologist, lawyer, platform_admin)

## Modelo de negócio

Modelo híbrido: software + operação especializada (não é SaaS puro).

- **Receita recorrente**: Assinaturas mensais/anuais (tiers: Starter, Pro, Elite, Organization)
- **Serviços**: Consultoria de carreira, análise de vídeo, revisão de contratos, projetos de captação
- **Receita variável**: Setup fees, gestão de patrocínio, portfólios premium

## Roadmap

Fase 0 (Discovery) → Fase 1 (MVP Operacional) → Fase 2 (Produto Assistido) → Fase 3 (B2B Lite) → Fase 4 (Jurídico/Patrocínio/Lei de Incentivo) → Fase 5 (Analytics Avançado) → Fase 6 (Ecossistema/Marketplace)

## Convenções de dados

- Datas em ISO 8601 com timezone
- Schemas JSON usam `$schema: draft-07`
- Entidades auditáveis com versionamento (consents, contratos, planos)
- Métricas de performance vinculadas a contexto de origem (treino/jogo/avaliação/vídeo)
- Idioma dos documentos: **português brasileiro**; schemas e código em **inglês**
