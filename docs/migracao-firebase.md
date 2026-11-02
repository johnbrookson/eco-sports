# Migração para Firebase (GCP) e backend real

Plano para tirar o basketball.net da Vercel, rodá-lo no Google Cloud via Firebase e trocar os mocks em memória por backend de verdade. Decidido com o John em 2026-10-29.

> Status em 2026-11-02: **Fases 1 e 2 concluídas** (app no App Hosting em `us-east4`, deploy automático da `main`, login pelo Firebase Authentication em produção). **Fase 3 em andamento**: fundação do banco em PR (ver a Fase 3). Fases 4 e 5 pendentes.

---

## Arquitetura alvo

| Peça | Hoje | Depois |
|---|---|---|
| Hospedagem do Next.js 16 | Vercel | **Firebase App Hosting** (Cloud Run por baixo), deploy automático a cada push no GitHub |
| Login | Stub JWT com usuários mock | **Firebase Authentication** + cookie de sessão do Admin SDK (feito na Fase 2) |
| Banco | Arrays em memória (`lib/mock/*`) | **Cloud SQL for PostgreSQL** via **Firebase Data Connect** |
| Fotos e vídeos | URLs externas | **Cloud Storage for Firebase** |
| Segredos | `web/.env.local` | **Secret Manager** (referenciado no `apphosting.yaml`) |
| Domínio | `*.vercel.app` | `basketball.net.br` apontado para o App Hosting |

**Por que App Hosting e não Firebase Hosting:** o site do EC é estático e cabe no Firebase Hosting clássico. O basketball.net tem Server Actions, `proxy.ts`, páginas dinâmicas e login, então precisa de servidor Node. É isso que o App Hosting faz para Next.js.

**Por que Postgres (Data Connect) e não Firestore:** o domínio é relacional (tenants, vínculo responsável → atleta, papéis por organização, consentimentos versionados) e a LGPD pede integridade referencial e trilha de auditoria. Data Connect mantém o Postgres gerenciado pelo Firebase e gera um SDK tipado.

**Região: tudo em `us-east4` (Virgínia).** A preferência inicial era São Paulo, mas o backend do App Hosting ficou em `us-east4`. Quem consulta o banco é sempre o servidor, nunca o navegador: com o banco em São Paulo, cada consulta atravessaria o continente na ida e na volta, e uma página com várias consultas em sequência somaria essas viagens. Decidido pelo John em 2026-11-02: banco e servidor juntos na Virgínia. Os dados ficam fora do Brasil, o que a LGPD permite com base legal para a transferência internacional (art. 33). A região da instância do Cloud SQL não muda depois de criada.

---

## O que já está pronto no repositório

```
firebase.json                    App Hosting (rootDir web/), Data Connect e emuladores
web/apphosting.yaml              Recursos do Cloud Run
dataconnect/dataconnect.yaml     Serviço "basketball-net", Cloud SQL "basketball-net-pg"
dataconnect/schema/schema.gql    Tabelas traduzidas dos JSON Schemas de schemas/
dataconnect/connector/*.gql      Operações do app: perfil público, vitrine, atleta logado, responsável
dataconnect/seed/seed.gql        Carga dos dados demo (fora do conector; roda pela CLI)
web/src/dataconnect-generated/   SDK gerado para o Admin SDK (`npm run dataconnect:generate`)
web/src/lib/data/                Camada de dados sobre o SDK gerado
```

Tabelas: `Tenant`, `User` (id = uid do Firebase Auth), `OrganizationMembership`, `Athlete`, `GuardianRelationship`, `Consent` e `PerformanceEvent`. Ficaram de fora por enquanto `service-contract` e `servicos-taxonomia`, que não têm tela ainda.

Para rodar localmente sem nuvem: `npm run emulators` e `npm run seed:data` em `web/` (ver `web/README.md`).

---

## Fases

### Fase 0 — Pré-requisitos (John)

1. Criar o projeto no console do Firebase e ativar o plano **Blaze**, que o App Hosting e o Cloud SQL exigem. Feito: projeto `basketball-net`, registrado como padrão em `.firebaserc`.
2. Garantir que o código está num repositório no GitHub e conectar o Firebase a ele.
3. Ter acesso ao DNS de `basketball.net.br`.

### Fase 1 — Paridade com a Vercel (concluída em 2026-10-29)

Objetivo: o mesmo app de hoje, ainda com mocks, rodando no App Hosting.

- Criar o backend do App Hosting apontando para o repositório. **Atenção:** o wizard do console deixa o diretório raiz como `/`; é preciso mudar para `web` em Configurações → Implantação, senão o build falha com "package.json not found".
- Criar o segredo `session-secret` e dar acesso ao backend (`firebase apphosting:secrets:grantaccess session-secret --backend basketball-net --project basketball-net`). Deixou de ser usado na Fase 2 e pode ser apagado do Secret Manager.
- `.vercel/` não está versionado (está no `.gitignore`); o projeto na Vercel só é desligado na Fase 5.
- Validar no link de prévia do App Hosting: home, vitrine, perfil público, login demo, `/app`.

**Risco a validar aqui:** suporte ao Next.js 16 (com `proxy.ts`) no adaptador do App Hosting. Se algo quebrar, esta fase existe justamente para descobrir isso antes de mexer em dados.

### Fase 2 — Firebase Authentication (em produção desde 2026-10-29)

Feito no código:

- Login por e-mail e senha conferido no servidor pela REST do Identity Toolkit, sem SDK do Firebase no cliente: a Server Action e o formulário com `useActionState` continuam iguais.
- O ID token vira **session cookie** do Admin SDK (`createSessionCookie`, 7 dias), verificado a cada request (`verifySessionCookie`). DAL, `proxy.ts` e telas não mudaram.
- Papéis e tenants **não** vão para custom claims: vêm do mapping indexado pelo uid (`mock-users.ts` até a Fase 3, depois `User`/`OrganizationMembership`).
- Signup cria o usuário no Firebase Auth com o uid do mapping.
- Usuários demo: `npm run seed:auth` (idempotente). Local roda no emulador do Auth (ver `web/README.md`).
- O `SESSION_SECRET` saiu do `apphosting.yaml`.

Passos no console (John):

1. Authentication → Começar → ativar o provedor **E-mail/senha**.
2. Criar os usuários demo no projeto real: `gcloud auth application-default login` e depois `npm run seed:auth` dentro de `web/`.
3. Depois do merge, testar login demo e um cadastro novo. Se aparecer erro de permissão no log, dar o papel "Firebase Authentication Admin" à conta `firebase-app-hosting-compute@basketball-net.iam.gserviceaccount.com`.

Limitação até a Fase 3: o mapping de contas criadas pelo cadastro é in-memory. Depois de um restart ou em outra instância do Cloud Run, a conta existe no Firebase mas o login mostra "perfil não carregado". Os usuários demo não têm esse problema. Para evitar o caso das várias instâncias (login que volta para `/login` sem mensagem), o `apphosting.yaml` fica com `maxInstances: 1` até a Fase 3; o restart por ociosidade continua apagando contas novas.

### Fase 3 — Banco (Data Connect + Cloud SQL)

Três PRs. Cada merge na `main` vai direto para produção, então o app precisa ficar consistente entre um PR e o seguinte: se as telas públicas lessem do banco enquanto o editor ainda gravasse na memória, a edição de um atleta não apareceria no perfil dele.

1. **Fundação, sem mudança de comportamento.** Região, SDK para o Admin SDK, carga dos dados demo, emuladores, Vitest e a camada `lib/data/` com as leituras públicas, testada contra o emulador mas ainda não ligada às telas. Depois do merge: `firebase deploy --only dataconnect` (cria a instância do Cloud SQL e aplica o esquema; novas instâncias têm período gratuito) e `npm run seed:data` no projeto real.
2. **Atletas, performance e vínculos.** Todas as leituras e escritas desses dados passam para o banco (perfil público, vitrine, área logada, editor, eventos, aprovações), mantendo as assinaturas de `lib/mock/*`. O cadastro grava o atleta no banco.
3. **Usuários.** DAL e cadastro trocam o `mock-users.ts` por `User`/`OrganizationMembership`. O `maxInstances` volta para 4.

Decisões, medidas no emulador em 2026-11-02:

- **Só o servidor executa as operações.** Cada operação do conector vira um endpoint na internet, e uma operação `@auth(level: PUBLIC)` pode ser chamada por qualquer um com a API key do app, que é pública. As leituras do perfil devolvem campos que a página só mostra conforme as flags granulares (contato, nascimento, cidade), então chamá-las direto vazaria esses dados. Como o navegador nunca fala com o banco, as operações são `@auth(level: NO_ACCESS)` e o Admin SDK as executa como administrador. A autorização de quem vê o quê fica na DAL; os filtros de linha (perfil publicado, descobrível, estatísticas liberadas) ficam na operação. Um teste garante que visitante e usuário logado são recusados. Isso substitui a ideia de executar em nome do usuário (impersonation).
- **SDK gerado para o Admin SDK** (`adminNodeSdk` no `connector.yaml`), e não o SDK de cliente, que pressupõe login no navegador.
- **Slug único na base toda**, e não por tenant: a URL `/atleta/[slug]` não carrega o tenant.
- **Ids.** O Data Connect devolve UUID sem hífens; a camada de dados põe no formato canônico, o mesmo dos mocks. Os ids dos mocks que não eram UUID (tenant, eventos, vínculo) viram UUID v5 do id antigo na carga, então rodar de novo atualiza em vez de duplicar.
- **Filtro opcional.** No Data Connect uma variável `null` vira `IS NULL`; a camada de dados omite o filtro vazio.
- **Carga em lotes.** O Data Connect limita o tamanho de cada variável: os 39 eventos de uma vez foram recusados, então vão em lotes de 20.
- **Fora do banco por ora:** o bloco `consents` do atleta (virá da tabela `Consent`, no consent flow LGPD) e `guardians[]` (contatos de responsáveis sem conta; nenhuma tela lê).

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
