import "server-only";

import { getApps, initializeApp } from "firebase-admin/app";
import { getDataConnect, type DataConnect } from "firebase-admin/data-connect";
import { connectorConfig } from "@basketball-net/dataconnect";

// Acesso ao banco (Data Connect → Cloud SQL) pelo servidor, com o SDK gerado a
// partir de dataconnect/connector/*.gql (`@basketball-net/dataconnect`).
//
// No App Hosting usa as credenciais padrão do serviço, como o Auth. Localmente
// usa o emulador quando DATA_CONNECT_EMULATOR_HOST está definido (ver
// web/README.md).
//
// O servidor é o único cliente do banco: o navegador nunca fala com o Data
// Connect. Por isso as operações são @auth(level: NO_ACCESS), e o Admin SDK as
// executa como administrador. Quem decide o que cada pessoa pode ver ou mudar
// é a DAL (lib/auth/dal.ts), e o banco aplica os filtros de linha de cada
// operação.

export function getDataConnectClient(): DataConnect {
  const app = getApps()[0] ?? initializeApp();
  return getDataConnect(connectorConfig, app);
}
