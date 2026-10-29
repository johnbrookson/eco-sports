# Migração para Firebase (GCP) e backend real

Plano para tirar o basketball.net da Vercel, rodá-lo no Google Cloud via Firebase e trocar os mocks em memória por backend de verdade. Decidido com o John em 2026-10-29.

> Status: **planejado**. Os arquivos de infraestrutura (`firebase.json`, `web/apphosting.yaml`, `dataconnect/`) já existem e o esquema do banco compila no emulador do Data Connect. Nada foi publicado nem criado na nuvem.

---

## Arquitetura alvo

| Peça | Hoje | Depois |
|---|---|---|
| Hospedagem do Next.js 16 | Vercel | **Firebase App Hosting** (Cloud Run por baixo), deploy automático a cada push no GitHub |
| Login | Stub JWT (`lib/auth/session.ts`) com usuários mock | **Firebase Authentication** + cookie de sessão do Admin SDK |
| Banco | Arrays em memória (`lib/mock/*`) | **Cloud SQL for PostgreSQL** via **Firebase Data Connect** |
| Fotos e vídeos | URLs externas | **Cloud Storage for Firebase** |
| Segredos | `web/.env.local` | **Secret Manager** (referenciado no `apphosting.yaml`) |
| Domínio | `*.vercel.app` | `basketball.net.br` apontado para o App Hosting |

**Por que App Hosting e não Firebase Hosting:** o site do EC é estático e cabe no Firebase Hosting clássico. O basketball.net tem Server Actions, `proxy.ts`, páginas dinâmicas e login, então precisa de servidor Node. É isso que o App Hosting faz para Next.js.

**Por que Postgres (Data Connect) e não Firestore:** o domínio é relacional (tenants, vínculo responsável → atleta, papéis por organização, consentimentos versionados) e a LGPD pede integridade referencial e trilha de auditoria. Data Connect mantém o Postgres gerenciado pelo Firebase, gera um SDK tipado e aplica regras `@auth` nas próprias operações.

**Região:** preferência por `southamerica-east1` (São Paulo), por latência e LGPD. Antes de criar os recursos, confirmar no console se App Hosting e Data Connect estão disponíveis nessa região. Se algum não estiver, usar `us-east4` só para ele, mantendo o Cloud SQL em São Paulo sempre que possível.

---

## O que já está pronto no repositório

```
firebase.json                    App Hosting (rootDir web/), Data Connect e emuladores
web/apphosting.yaml              Recursos do Cloud Run e o segredo SESSION_SECRET
dataconnect/dataconnect.yaml     Serviço "basketball-net", Cloud SQL "basketball-net-pg"
dataconnect/schema/schema.gql    Tabelas traduzidas dos JSON Schemas de schemas/
dataconnect/connector/*.gql      Primeiras operações: perfil público, vitrine, atleta logado, responsável
```

Tabelas: `Tenant`, `User` (id = uid do Firebase Auth), `OrganizationMembership`, `Athlete`, `GuardianRelationship`, `Consent` e `PerformanceEvent`. Ficaram de fora por enquanto `service-contract` e `servicos-taxonomia`, que não têm tela ainda.

Para rodar localmente sem nuvem: `firebase emulators:start --only dataconnect,auth --project demo-basketball-net`.

---

## Fases

### Fase 0 — Pré-requisitos (John)

1. Criar o projeto no console do Firebase e ativar o plano **Blaze**, que o App Hosting e o Cloud SQL exigem. Feito: projeto `basketball-net`, registrado como padrão em `.firebaserc`.
2. Garantir que o código está num repositório no GitHub e conectar o Firebase a ele.
3. Ter acesso ao DNS de `basketball.net.br`.

### Fase 1 — Paridade com a Vercel

Objetivo: o mesmo app de hoje, ainda com mocks, rodando no App Hosting.

- Criar o backend do App Hosting apontando para o repositório e `rootDir: web`.
- Criar o segredo `session-secret` no Secret Manager.
- `.vercel/` não está versionado (está no `.gitignore`); o projeto na Vercel só é desligado na Fase 5.
- Validar no link de prévia do App Hosting: home, vitrine, perfil público, login demo, `/app`.

**Risco a validar aqui:** suporte ao Next.js 16 (com `proxy.ts`) no adaptador do App Hosting. Se algo quebrar, esta fase existe justamente para descobrir isso antes de mexer em dados.

### Fase 2 — Firebase Authentication

- Login por e-mail e senha (e Google, se quiser) no cliente com o Firebase JS SDK.
- O cliente manda o ID token para uma Server Action, que cria um **session cookie** com o Admin SDK (`createSessionCookie`).
- `lib/auth/session.ts` passa a verificar esse cookie (`verifySessionCookie`), e `lib/auth/actions.ts` troca de mock para Firebase. A DAL (`dal.ts`) e as telas não mudam: o payload continua `sub`, `email`, `name`, `roles`, `tenants`.
- Papéis (`roles`) e tenants vêm da tabela `User`/`OrganizationMembership`, não de custom claims. Assim mudar um papel não exige renovar token.
- Signup cria o usuário no Auth e as linhas `User` + `Tenant` individual numa mesma mutation.

### Fase 3 — Banco (Data Connect + Cloud SQL)

- `firebase deploy --only dataconnect` cria a instância do Cloud SQL e aplica o esquema. Novas instâncias do Data Connect têm período gratuito inicial.
- Script de seed com os atletas, usuários e eventos de performance dos mocks atuais.
- Trocar `lib/mock/*` por chamadas ao SDK gerado, mantendo as mesmas assinaturas (`getPublicAthleteBySlug`, `searchDiscoverableAthletes`, `updateAthleteById`...). As Server Actions rodam no servidor com o Admin SDK, executando as operações em nome do usuário logado (impersonation com o `uid`), para que as regras `@auth` valham também ali.
- `isSlugAvailableForAthlete` vira a restrição única `(tenant, slug)` do banco.

### Fase 4 — Storage

- Upload de foto do atleta para o Cloud Storage, com regras que só permitem ao próprio atleta (ou responsável) gravar.
- `next.config.ts`: trocar o `remotePatterns` do Unsplash pelo domínio do bucket.

### Fase 5 — Domínio e desligamento da Vercel

- Apontar `basketball.net.br` para o App Hosting (o console mostra os registros DNS).
- Depois de alguns dias estável, desligar o projeto na Vercel.

---

## Custos esperados (ordem de grandeza)

- App Hosting / Cloud Run: paga por uso, com escala a zero. Perto de zero com pouco tráfego.
- Cloud SQL (menor instância): cerca de US$ 10/mês depois do período gratuito. É o único custo fixo.
- Authentication: gratuito até 50 mil usuários ativos/mês.
- Storage e Secret Manager: centavos no volume inicial.

## Fora deste plano

- E-mail `@basketball.net.br` (Google Workspace): confirmado pelo John em 2026-10-29. É independente da migração: assinatura no Google Workspace e registros MX/SPF/DKIM no DNS do domínio.
- Consent flow LGPD completo: a tabela `Consent` já existe no esquema, mas o fluxo de telas é trabalho separado.
