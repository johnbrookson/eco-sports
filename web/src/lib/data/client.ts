import "server-only";

import { getDataConnect, type DataConnect } from "firebase-admin/data-connect";
import { connectorConfig } from "@basketball-net/dataconnect";

import { getAdminApp } from "@/lib/firebase-admin";

// Acesso ao banco (Data Connect → Cloud SQL) pelo servidor, com o SDK gerado a
// partir de dataconnect/connector/*.gql (`@basketball-net/dataconnect`).
//
// Usa o app do Admin SDK compartilhado com o Auth (lib/firebase-admin.ts).
// Localmente usa o emulador quando DATA_CONNECT_EMULATOR_HOST está definido
// (ver web/README.md).
//
// O servidor é o único cliente do banco: o navegador nunca fala com o Data
// Connect. Por isso as operações são @auth(level: NO_ACCESS), e o Admin SDK as
// executa como administrador. Quem decide o que cada pessoa pode ver ou mudar
// é a DAL (lib/auth/dal.ts), e o banco aplica os filtros de linha de cada
// operação.

export function getDataConnectClient(): DataConnect {
  return getDataConnect(connectorConfig, getAdminApp());
}
