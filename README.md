# Eco-Sports Platform

Plataforma para **gestão completa de carreira e desenvolvimento de atletas**, integrando serviços técnicos, estratégicos, educacionais, jurídicos e financeiros. Nicho inicial: **basketball em categorias de base**.

O objetivo do projeto é estruturar um **ecossistema de suporte ao atleta**, permitindo planejamento de carreira, desenvolvimento técnico, análise de desempenho, marketing esportivo e captação de recursos.

---

## Estrutura do repositório

```text
/web                          ← aplicação Next.js
  /src/app/                   ← rotas (landing page, design system)
  /src/app/globals.css        ← design tokens (temas indigo + basketball)
  /src/components/ui/         ← componentes shadcn/ui
  /src/components/            ← componentes do projeto
/docs                         ← documentação de arquitetura e negócio
  arquitetura.md
  modelo-negocio.md
  roadmap.md
/schemas                      ← JSON Schemas do domínio
  athlete.json
  performance-metrics.json
  servicos-taxonomia.json
/diagrams
  platform-architecture.drawio
```

### Documentos

- `docs/arquitetura.md`: visão da arquitetura da plataforma, domínios, módulos, integrações e modelo de dados.
- `docs/modelo-negocio.md`: proposta de valor, segmentos, monetização, canais, parceiros e métricas.
- `docs/roadmap.md`: roadmap por fases, do MVP até escala.
- `schemas/athlete.json`: schema base de cadastro e contexto do atleta.
- `schemas/performance-metrics.json`: schema para métricas de desempenho, treinos, jogos e análises.
- `diagrams/platform-architecture.drawio`: diagrama Draw.io com visão macro da plataforma.

---

## Pilares da plataforma

A plataforma foi concebida com base nos seguintes pilares, seguindo modelos utilizados por organizações esportivas internacionais para **desenvolvimento integral do atleta**:

- Gestão de Carreira
- Desenvolvimento Técnico
- Treinamentos Específicos
- Gestão de Desempenho
- Marketing e Portfólio
- Suporte Jurídico
- Captação de Recursos e Patrocínios
- Assessoria de Imprensa
- Suporte Psicológico
- Planejamento Financeiro
- Preparação Física
- Educação Acadêmica
- Network Profissional

---

## Objetivo da plataforma

Criar uma infraestrutura digital que permita:

- acompanhamento completo da carreira esportiva
- análise de desempenho baseada em dados
- gestão de marca pessoal do atleta
- conexão com clubes, scouts e patrocinadores
- acesso a suporte jurídico, psicológico e financeiro
- captação estruturada de recursos

---

## Arquitetura conceitual

A plataforma é estruturada em módulos:

```text
eco-sports
│
├── career-management
├── performance-analytics
├── athlete-portfolio
├── sponsorship-management
├── legal-support
├── training-programs
├── mental-support
├── financial-planning
└── networking-platform
```

---

## Público-alvo

- Atletas em formação
- Atletas profissionais
- Treinadores
- Clubes
- Academias
- Agentes esportivos
- Investidores e patrocinadores
- Famílias
- Scouts

---

## Stack técnica

### Implementado

- **Frontend (web)**: Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Design System**: Dois temas configuráveis — Indigo (azul/violet) e Basketball (laranja/navy)
- **Fonte**: Inter (Google Fonts)
- **Ícones**: Lucide React
- **Componentes**: Button, Input, Textarea, Card, Badge, Avatar, Dialog, Table, Select, Tabs, Separator, Tooltip
- **Styleguide visual**: `/design-system`

### Planejado

- Mobile: React Native ou Flutter
- Backend: Go ou Node.js (monólito modular)
- Banco: PostgreSQL + S3-compatible + Redis
- Auth: Keycloak, Clerk ou Auth0
- Análise de vídeo com IA
- Dashboards de desempenho
- Sistema de scouting
- CRM para patrocinadores

### Comandos

```bash
cd web
npm run dev      # servidor de desenvolvimento
npm run build    # build de produção
npm run lint     # linting
```

---

## Referências oficiais e fontes de contexto

As referências abaixo servem como base conceitual para a modelagem do projeto. O foco não é copiar esses programas, mas aproveitar padrões consolidados de desenvolvimento integral do atleta, análise de desempenho e financiamento esportivo.

### Comitê Olímpico Internacional / Athlete365

- Athlete365 é a plataforma oficial do IOC para apoiar atletas ao longo da carreira e na transição pós-esporte.
- O hub Career+ reúne recursos, workshops, mentoria e apoio de carreira.
- O Athlete Career Portal oferece conteúdo, cursos e oportunidades voltadas à carreira do atleta.

Referências:
- https://www.olympics.com/athlete365
- https://www.olympics.com/athlete365/topics/career-plus
- https://www.olympics.com/athlete365/topics/acp
- https://www.olympics.com/athlete365/learning

### NCAA

- A NCAA mantém exigências e programas de desenvolvimento para student-athletes, com foco em aconselhamento de carreira, life skills, saúde, preparação acadêmica, nutrição, condicionamento e literacia financeira.

Referências:
- https://www.ncaa.org/news/2024/8/1/media-center-new-nil-health-and-academic-benefits-take-effect-for-ncaa-student-athletes-aug-1.aspx
- https://www.ncaa.org/sports/2024/1/31/change.aspx
- https://fs.ncaa.org/Docs/eligibility_center/Student_Resources/CBSA.pdf

### Hudl

- A Hudl se posiciona como plataforma de tecnologia esportiva com vídeo, dados, scouting e análise de performance.

Referências:
- https://www.hudl.com/en_gb/
- https://www.hudl.com/sports
- https://www.hudl.com/blog/performance-analysis-in-football
- https://www.hudl.com/en_gb/products/adi

### Instat / Wyscout

Plataformas profissionais de análise de desempenho utilizadas por clubes e scouts.

- https://www.instatsport.com
- https://wyscout.com

### Ministério do Esporte / Lei de Incentivo ao Esporte

- A Lei de Incentivo ao Esporte (Lei nº 11.438/2006) permite que empresas destinem parte do imposto de renda para financiar projetos esportivos e paradesportivos.
- O portal oficial do Ministério do Esporte centraliza regras, cartilhas, modelos, manuais e acesso aos sistemas.
- Houve atualização regulatória recente em 2026, com novo decreto e nova portaria sobre fluxo e procedimentos.

Referências:
- https://www.gov.br/esporte/pt-br/acoes-e-programas/lei-de-incentivo-ao-esporte
- https://www.gov.br/esporte/pt-br/acesso-a-informacao/lei-de-incentivo-ao-esporte/cartilha-lei-de-incentivo-ao-esporte
- https://www.gov.br/esporte/pt-br/acoes-e-programas/lei-de-incentivo-ao-esporte/modelos-e-manuais-3
- https://www.gov.br/esporte/pt-br/acoes-e-programas/lei-de-incentivo-ao-esporte/acesso-aos-sistemas
- https://www.gov.br/secom/pt-br/acompanhe-a-secom/noticias/2026/03/publicado-decreto-que-aprimora-a-lei-de-incentivo-ao-esporte
- https://www.gov.br/esporte/pt-br/noticias-e-conteudos/esporte/ministerio-do-esporte-atualiza-regras-da-lei-de-incentivo-e-fortalece-projetos-sociais

---

## Visão

Criar uma plataforma capaz de **estruturar o desenvolvimento de atletas de forma integrada**, conectando esporte, educação, tecnologia e mercado.

---

## Observações

- Os schemas foram escritos para servir de ponto de partida para backend, APIs e persistência.
- O diagrama `.drawio` pode ser aberto no Draw.io / diagrams.net e evoluído conforme o produto amadurecer.
- O design system suporta dois temas (indigo e basketball) via `data-theme` no HTML, com persistência em localStorage.

---

## Licença

Este projeto é conceitual e educacional.

## Contribuição

Sugestões e melhorias são bem-vindas para expandir o modelo de desenvolvimento esportivo e suas aplicações tecnológicas.
