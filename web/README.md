# basketball.net — app web

Next.js 16 (App Router). Publicado no Firebase App Hosting a cada merge na `main`.

## Rodando localmente

O login usa o Firebase Authentication. Localmente ele roda no emulador, sem tocar no projeto real.

1. Crie `web/.env.local` (gitignored):

   ```
   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
   GCLOUD_PROJECT=demo-basketball-net
   ```

2. Em um terminal, suba o emulador do Auth:

   ```bash
   npm run emulators
   ```

3. Em outro, crie os usuários demo no emulador e suba o app:

   ```bash
   FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run seed:auth
   npm run dev
   ```

O emulador não guarda dados entre execuções: rode o `seed:auth` sempre que subir o emulador de novo. A interface do emulador fica em http://127.0.0.1:4000.

## Usuários demo

| E-mail | Senha | Persona |
|---|---|---|
| `joao@demo.basketball.net` | `joao123` | atleta |
| `mariana@demo.basketball.net` | `mariana123` | atleta |
| `enrico@demo.basketball.net` | `enrico123` | atleta |
| `rodrigo@demo.basketball.net` | `rodrigo123` | responsável pelo Enrico |

No projeto real eles são criados uma vez com `gcloud auth application-default login` seguido de `npm run seed:auth`.

## Comandos

```bash
npm run dev        # dev server (Turbopack)
npm run build      # build de produção
npm run lint       # ESLint
node_modules/.bin/tsc --noEmit
```
