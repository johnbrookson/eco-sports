# Arquitetura da Plataforma

## Visão geral

A Eco-Sports Platform é uma plataforma modular para gestão integrada de carreira e desenvolvimento de atletas. O desenho arquitetural prioriza separação por domínios, interoperabilidade, escalabilidade progressiva e capacidade de evoluir de um MVP operacional para um SaaS multi-tenant.

## Objetivos arquiteturais

- centralizar dados do atleta em um perfil único
- consolidar métricas de treino, jogo, vídeo e evolução
- suportar workflows de carreira, jurídico, patrocínio e networking
- permitir operação por diferentes perfis: atleta, família, treinador, scout, clube, patrocinador e staff interno
- viabilizar integrações com vídeo, analytics, CRM e pagamentos
- manter trilha de auditoria para contratos, consentimentos e documentação

## Princípios

1. Modularidade por domínio.
2. API-first.
3. Multi-tenant desde o desenho lógico.
4. Eventos de domínio para integrações e automações.
5. Segurança e consentimento por padrão.
6. Evolução incremental: monólito modular primeiro, microserviços apenas quando houver necessidade operacional.

## Domínios centrais

### 1. Identity & Access

Responsável por autenticação, autorização, RBAC e gestão de perfis.

Papéis iniciais:
- athlete
- parent_guardian
- coach
- scout
- club_manager
- sponsor
- psychologist
- lawyer
- platform_admin

### 2. Athlete Profile

Agrega os dados principais do atleta:
- identificação
- dados físicos
- modalidade
- categoria
- histórico esportivo
- educação
- contatos
- documentos e consentimentos

### 3. Career Management

Fluxos de:
- avaliação inicial
- metas de temporada
- plano de carreira
- milestones
- mentorias
- transições de categoria
- progresso por ciclo

### 4. Performance & Analytics

Camada responsável por:
- métricas de treino e jogo
- estatísticas por período
- benchmarking
- monitoramento contínuo
- alertas de evolução ou regressão
- geração de relatórios técnicos

### 5. Video Analysis

Entidades e fluxos:
- ingestão de vídeo
- marcação de eventos
- highlights
- anotações técnicas
- feedback visual
- vinculação com sessões de treino ou partidas

### 6. Training Programs

Responsável por:
- plano técnico individual
- plano físico
- calendário de treinos
- cargas e sessões
- objetivos por habilidade
- evolução por microciclo e macrociclo

### 7. Portfolio & Branding

Funcionalidades:
- portfólio digital do atleta
- perfil público opcional
- mídia, conquistas e estatísticas selecionadas
- highlights
- kits para scouts e clubes
- gestão de marca pessoal

### 8. Legal & Compliance

Fluxos:
- contratos
- direitos de imagem
- documentos jurídicos
- negociações
- consentimentos e uso de dados
- trilha de revisão e validade contratual

### 9. Sponsorship & Funding

Fluxos:
- prospecção de patrocinadores
- gestão de pipeline comercial
- campanhas
- contrapartidas
- projetos da Lei de Incentivo ao Esporte
- prestação de contas e evidências

### 10. Wellbeing & Education

Abrange:
- suporte psicológico
- planejamento financeiro
- educação acadêmica
- trilhas formativas
- conteúdos e guias

### 11. Communication & CRM

Responsável por:
- notificações
- lembretes
- comunicação entre stakeholders
- campanhas para patrocinadores
- relacionamento com imprensa e mídia

## Arquitetura lógica sugerida

### Frontend

- Web App responsivo para operação administrativa e dashboards.
- Portal do atleta e da família.
- Portal de scouts, clubes e patrocinadores.
- Aplicativo mobile focado em agenda, progresso, notificações e upload de evidências.

### Backend

Recomendação inicial:
- monólito modular com boundaries explícitos
- APIs REST para operações transacionais
- filas/event bus para tarefas assíncronas

Módulos internos:
- auth
- athlete-profile
- career
- performance
- video
- training
- portfolio
- legal
- sponsorship
- billing
- notifications
- reporting

### Dados

- Banco relacional para dados transacionais.
- Object storage para vídeos, imagens, relatórios e documentos.
- Search index opcional para busca em perfis, contratos e conteúdos.
- Data mart analítico para KPIs, séries temporais e benchmarking.

## Integrações futuras

- ferramentas de vídeo e tagging
- gateways de pagamento
- CRM comercial
- provedores de assinatura eletrônica
- sistemas de calendário
- BI / analytics
- WhatsApp ou e-mail transacional

## Modelo multi-tenant

Tenant pode representar:
- operação interna da plataforma
- academia / escola / projeto social
- clube parceiro
- agência / assessoria

Cada registro sensível deve carregar `tenantId` e política de acesso correspondente.

## Segurança e LGPD

Controles mínimos:
- consentimento explícito para uso de imagem e dados de menores
- segregação por tenant
- logs de auditoria
- versionamento de consentimentos e contratos
- criptografia em repouso e em trânsito
- política de retenção e exclusão de dados

## Fluxos críticos

### Jornada do atleta

1. cadastro
2. consentimentos
3. avaliação inicial
4. criação do plano de carreira
5. inclusão em programa técnico/físico
6. coleta de métricas e vídeos
7. geração de portfólio
8. exposição para clubes/scouts/patrocinadores

### Jornada de patrocínio

1. cadastro do prospect
2. proposta comercial
3. negociação
4. contrato
5. execução de contrapartidas
6. evidências e relatórios
7. renovação

## Stack inicial sugerida

### Opção pragmática

- Frontend: Next.js
- Backend: Go ou Node.js em arquitetura modular
- Banco: PostgreSQL
- Storage: S3 compatível
- Cache: Redis
- Eventos: NATS ou RabbitMQ
- Auth: Keycloak, Clerk ou Auth0
- Observabilidade: OpenTelemetry + Grafana stack

## Entidades nucleares

- Athlete
- Guardian
- Coach
- Team
- Club
- SeasonGoal
- TrainingPlan
- TrainingSession
- MatchPerformance
- VideoAsset
- Highlight
- Contract
- SponsorLead
- SponsorshipDeal
- IncentiveProject
- Report
- Consent

## Estratégia de evolução

### Fase 1
MVP com:
- athlete profile
- career management
- performance tracking
- portfolio digital
- relatórios básicos

### Fase 2
- vídeo e highlights
- CRM de patrocinadores
- contratos e consentimentos
- painéis por stakeholder

### Fase 3
- analytics avançado
- benchmarking
- automações
- recursos multi-tenant completos
- marketplace e networking
