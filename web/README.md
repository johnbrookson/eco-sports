# basketball.net — app web

Next.js 16 (App Router). Publicado no Firebase App Hosting a cada merge na `main`.

## Rodando localmente

O login usa o Firebase Authentication e os dados vão para o Firebase Data Connect (Postgres). Localmente os dois rodam em emuladores, sem tocar no projeto real.

1. Crie `web/.env.local` (gitignored):

   ```
   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
   DATA_CONNECT_EMULATOR_HOST=127.0.0.1:9399
   GCLOUD_PROJECT=demo-basketball-net
   ```

2. Em um terminal, suba os emuladores do Auth e do Data Connect:

   ```bash
   npm run emulators
   ```

3. Em outro, carregue os usuários e os dados demo nos emuladores e suba o app:

   ```bash
   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run seed:auth
   DATA_CONNECT_EMULATOR_HOST=127.0.0.1:9399 npm run seed:data
   npm run dev
   ```

O emulador do Auth não guarda dados entre execuções: rode o `seed:auth` sempre que subir o emulador de novo. O do Data Connect guarda (em `dataconnect/.dataconnect/`, gitignored); o `seed:data` pode rodar quantas vezes quiser e redefine os dados demo sem duplicar linhas. A interface dos emuladores fica em http://127.0.0.1:4000.

Atenção ao nome da variável: o app (Admin SDK) lê `DATA_CONNECT_EMULATOR_HOST`; a CLI do Firebase lê `FIREBASE_DATA_CONNECT_EMULATOR_HOST`. O `seed:data` aceita qualquer uma das duas, mas só do shell: ele não lê o `.env.local`. Sem nenhuma delas, ele se recusa a rodar, a menos que receba o projeto real em `--project`.

## Banco (Data Connect)

O esquema fica em `dataconnect/schema/schema.gql` e as operações em `dataconnect/connector/*.gql`. O app chama as operações pelo SDK gerado em `src/dataconnect-generated/` (pacote `@basketball-net/dataconnect`), sempre pelo servidor: as operações são `@auth(level: NO_ACCESS)`, e só o Admin SDK as executa. A camada de dados fica em `src/lib/data/`.

Depois de mudar um `.gql`, gere o SDK de novo e commite o resultado:

```bash
npm run dataconnect:generate
```

## Testes

```bash
npm test
```

Sobe um emulador do Data Connect só para a execução, carrega os dados demo e roda o Vitest. Os testes da camada de dados conferem que o banco devolve o mesmo que os mocks e que as regras de visibilidade valem no banco. Eles gravam e apagam linhas de teste num tenant próprio, e se recusam a rodar sem o emulador.

## Usuários demo

| E-mail | Senha | Persona |
|---|---|---|
| `joao@demo.basketball.net` | `joao123` | atleta |
| `mariana@demo.basketball.net` | `mariana123` | atleta |
| `enrico@demo.basketball.net` | `enrico123` | atleta |
| `rodrigo@demo.basketball.net` | `rodrigo123` | responsável pelo Enrico |

No projeto real eles são criados uma vez com `gcloud auth application-default login` seguido de `npm run seed:auth`. Os dados demo do banco vão com `npm run seed:data -- --project basketball-net`, que usa as credenciais do `firebase login` e sobrescreve os atletas demo com os mocks.

## Comandos

```bash
npm run dev        # dev server (Turbopack)
npm run build      # build de produção
npm run lint       # ESLint
npm test           # testes (emulador do Data Connect + Vitest)
node_modules/.bin/tsc --noEmit
```
