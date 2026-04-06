# Atores e Permissões — Eco-Sports

Este documento define os **tipos de usuário** e **tenants** do SaaS Eco-Sports, o modelo de papéis (RBAC) inicial e uma matriz de permissões por domínio. Serve de base para o desenho do módulo de Identity & Access e para o mapeamento de telas por perfil.

> Escopo: MVP (Fase 1–2 do roadmap). Papéis de fases posteriores (marketplace avançado, B2B completo, Lei de Incentivo) estão marcados como *futuro*.

---

## 1. Princípios

- **Multi-tenant lógico**: todo dado sensível carrega `tenantId`. Um tenant pode ser uma **pessoa física** (atleta avulso, profissional autônomo) ou uma **organização** (clube, academia, projeto social).
- **O dado é do atleta, não do clube**. Performance, vídeos, portfólio e histórico acompanham o atleta entre organizações. Organizações têm acesso *concedido*, não propriedade.
- **Consentimento por padrão (LGPD)**. Atleta menor de idade exige consentimento ativo de um `parent_guardian`. Consentimentos são entidades versionadas e auditáveis.
- **Papel global × papel organizacional**. Um usuário pode ter múltiplos papéis: global (ex.: `professional` com especialidade `coach`) e dentro de uma ou mais organizações (ex.: `org_coach` no Clube X).
- **Especialidade ≠ papel**. Profissionais compartilham o papel `professional` mas possuem especialidades distintas (`coach`, `scout`, `psychologist`, `lawyer`, `physical_trainer`, `nutritionist`, `career_advisor`) com fluxos e compliance específicos.

---

## 2. Tipos de tenant

| Tenant | Descrição | Exemplos |
|---|---|---|
| `individual` | Pessoa física com conta autônoma na plataforma | Atleta avulso, profissional autônomo, patrocinador pessoa física |
| `organization` | Pessoa jurídica com múltiplos usuários vinculados | Clube, academia, escolinha, projeto social, empresa patrocinadora |

Um usuário pode pertencer a **um tenant individual** (sempre) e a **N tenants organizacionais** simultaneamente, com papéis diferentes em cada.

---

## 3. Atores (papéis globais)

### 3.1 `athlete` — Atleta
Usuário central da plataforma. Pode ser menor ou maior de idade.

- **Dono dos dados**: perfil, métricas, vídeos, portfólio, histórico.
- Se menor de idade: conta **vinculada a um ou mais `parent_guardian`**. Ações sensíveis (consentimentos, contratos, pagamentos, exposição pública) exigem aprovação do responsável.
- Pode estar vinculado a organizações (clube, escolinha) sem perder propriedade dos dados.

### 3.2 `parent_guardian` — Responsável
**Obrigatório pelo nicho inicial (base).** Não é sub-perfil do atleta — é um usuário independente com conta própria.

- Vincula-se a **N atletas** (filhos, tutelados).
- Aprova consentimentos LGPD, contratos, exposição pública, pagamentos e compartilhamento de dados sensíveis.
- Tem visibilidade completa do filho (performance, comunicação, agenda, finanças da carreira).
- Pode contratar serviços do marketplace em nome do atleta menor.

### 3.3 `professional` — Profissional
Papel único com **especialidade** obrigatória. Profissionais autônomos oferecem serviços via marketplace; também podem ser contratados diretamente por uma organização.

| Especialidade | Permissões / fluxos específicos |
|---|---|
| `coach` | Registra treinos, métricas, planos de desenvolvimento |
| `scout` | Consulta portfólios públicos, gera relatórios de observação |
| `physical_trainer` | Planos físicos, acompanhamento de carga e recuperação |
| `nutritionist` | Planos alimentares, acompanhamento nutricional |
| `psychologist` | Sessões com **sigilo reforçado** — dados segregados, acesso restrito |
| `lawyer` | Revisão/assinatura de contratos, compliance, direito desportivo |
| `career_advisor` | Gestão de carreira, recolocação, preparação para seletivas |
| `video_analyst` | Análise de vídeo, marcações táticas, highlights |

Um profissional pode ter **mais de uma especialidade**.

### 3.4 `sponsor` — Patrocinador
Categoria própria, não é um "profissional".

- Navega portfólios públicos de atletas (respeitando consentimentos).
- Propõe contratos de patrocínio (valores, contrapartidas, duração).
- Acompanha ROI (exposição, performance, engajamento do atleta patrocinado).
- Pode ser pessoa física (`individual`) ou pessoa jurídica (`organization` com papel `org_sponsor_manager`).

### 3.5 `platform_admin` — Administrador da plataforma (Ceronify)
Equipe interna Ceronify. Acesso transversal para suporte, operação especializada (consultoria, análise de vídeo feita pela equipe, revisão de contratos) e administração da plataforma.

- **Não é o mesmo que admin de organização.** Platform admin enxerga todos os tenants; org admin só o seu.
- Deve seguir trilha de auditoria rigorosa ao acessar dados de tenants (justificativa + log).

---

## 4. Papéis organizacionais

Aplicam-se a usuários **dentro de um tenant `organization`**. Um usuário pode ter um papel global (ex.: `professional/coach`) e simultaneamente um papel organizacional (ex.: `org_coach` no Clube X).

| Papel | Descrição |
|---|---|
| `org_admin` | Administra o tenant organizacional (membros, dados do clube, assinatura, faturamento). Não tem acesso a outros tenants. |
| `org_manager` | Gestor esportivo/diretor. Visão completa do elenco do clube, relatórios gerenciais. |
| `org_coach` | Treinador vinculado à organização. Registra métricas e planos dos atletas *daquele* elenco. |
| `org_scout` | Scout interno do clube. Avalia atletas próprios e observa externos. |
| `org_member` | Papel genérico de membro com acesso limitado (ex.: auxiliar técnico, staff). |
| `org_sponsor_manager` | *(quando o tenant é um patrocinador PJ)* gerencia propostas e contratos de patrocínio em nome da empresa. |

> Regra: papéis organizacionais só dão acesso a dados do **próprio tenant**. Acesso a dados de um atleta externo exige consentimento explícito do atleta/responsável (ex.: scout de outro clube consultando um portfólio público).

---

## 5. Matriz de permissões (MVP)

Legenda: **O** = owner (CRUD total + governança) · **W** = write (criar/editar) · **R** = read · **C** = consent (aprova) · **—** = sem acesso

| Domínio | athlete | parent_guardian | professional | sponsor | org_admin | org_coach / org_scout | platform_admin |
|---|---|---|---|---|---|---|---|
| **Athlete Profile** (próprio) | O | C + R | R (se contratado) | R (se público) | R (elenco) | R (elenco) | R (auditado) |
| **Performance & Analytics** | O | R | W (se contratado) | R (público) | R (elenco) | W (elenco) | R (auditado) |
| **Video Analysis** | O | R | W (se contratado) | R (público) | R (elenco) | W (elenco) | R (auditado) |
| **Training Programs** | R | C + R | W (se contratado) | — | R (elenco) | W (elenco) | R (auditado) |
| **Career Management** | O | C + R | W (career_advisor) | — | R (elenco) | R (elenco) | R (auditado) |
| **Portfolio & Branding** | O | C | W (se contratado) | R | R (elenco) | R (elenco) | R (auditado) |
| **Legal & Compliance (contratos)** | R | C + R | W (lawyer) | W (propostas) | W (próprio clube) | — | W (operação Ceronify) |
| **Sponsorship & Funding** | R | C + R | — | O (próprias) | R (atletas do clube) | — | R (auditado) |
| **Wellbeing — Psicologia** | O | R (limitado) | W (psychologist) ¹ | — | — | — | — ² |
| **Communication & CRM** | W (próprio) | W (próprio) | W (conversas contratadas) | W (propostas) | W (organização) | W (elenco) | R (auditado) |
| **Billing & Subscription** | O (conta própria) | O (do atleta menor) | O (conta própria) | O (conta própria) | O (organização) | — | W |
| **Tenant / Members** | — | — | — | — | O (organização) | — | O (global) |

¹ **Sigilo reforçado**: anotações clínicas do psicólogo são segregadas. Responsável vê apenas metadados (ocorrência de sessão, frequência), não conteúdo.
² Platform admin **não acessa** conteúdo clínico — apenas metadados de auditoria.

### Regras transversais

- Acesso de `professional` a dados de um atleta exige **contrato ativo** (vínculo de serviço) e consentimento do atleta/responsável.
- Acesso de `scout` externo a portfólio de atleta exige o portfólio estar marcado como **público** ou consentimento pontual.
- Psicólogos têm **isolamento clínico**: dados não são visíveis para org_coach, org_manager nem para outros profissionais — apenas para o próprio atleta (se maior) e, em parte, para o responsável.
- Toda escrita em dados do atleta por terceiros (`professional`, `org_*`) gera **evento de auditoria** com autor, timestamp e contexto.

---

## 6. Relação com schemas

- O schema [`athlete.json`](../schemas/athlete.json) é a entidade raiz do tenant individual do atleta.
- Será necessário adicionar schemas: `user`, `guardian_relationship`, `tenant`, `organization_membership`, `consent`, `service_contract`.
- `consent` é entidade versionada com: tipo, escopo, concedente (`parent_guardian` ou `athlete` maior), concedido-a (`professional` ou `organization`), data de emissão, data de expiração, status.

---

## 7. Observações para fases futuras

- **Fase 3 (B2B Lite)**: consolidar papéis organizacionais e fluxo de convite/onboarding de membros.
- **Fase 4 (Jurídico/Patrocínio/Lei de Incentivo)**: adicionar papel `incentive_project_manager` (gestor de projeto captado via Lei de Incentivo) e fluxo de prestação de contas.
- **Fase 6 (Marketplace)**: pode surgir o papel `partner_platform` (plataformas parceiras integradas via API, com escopo OAuth próprio).

---

## 8. Resumo rápido

Sete atores globais no MVP:

1. `athlete`
2. `parent_guardian` *(obrigatório — LGPD/base)*
3. `professional` *(com especialidade)*
4. `sponsor`
5. `org_admin` *(dentro de um tenant organization)*
6. `org_member` genérico + variantes (`org_coach`, `org_scout`, `org_manager`)
7. `platform_admin` *(Ceronify)*

Dois tipos de tenant: `individual` e `organization`.
