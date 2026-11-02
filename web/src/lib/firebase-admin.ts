import "server-only";

import { getApps, initializeApp, type App } from "firebase-admin/app";

// O app do Admin SDK, um por processo, compartilhado pelo Authentication
// (lib/auth/firebase.ts) e pelo Data Connect (lib/data/client.ts). Opção nova
// de inicialização entra aqui, e vale para os dois.
//
// No App Hosting (Cloud Run) usa as credenciais padrão do serviço e o
// FIREBASE_CONFIG injetado pelo Firebase. Localmente, os emuladores apontados
// por FIREBASE_AUTH_EMULATOR_HOST e DATA_CONNECT_EMULATOR_HOST (ver
// web/README.md).
export function getAdminApp(): App {
  return getApps()[0] ?? initializeApp();
}
