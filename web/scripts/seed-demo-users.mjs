// Cria (ou atualiza) os usuários demo no Firebase Authentication com o mesmo
// uid do mapping em src/lib/auth/mock-users.ts.
//
// Emulador local:  FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run seed:auth
// Projeto real:    gcloud auth application-default login && npm run seed:auth
//
// Pode rodar quantas vezes quiser: usuário existente tem e-mail, nome e senha
// redefinidos.

import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const DEMO_USERS = [
  { uid: "usr-joao", email: "joao@demo.basketball.net", password: "joao123", name: "João Silva" },
  { uid: "usr-mariana", email: "mariana@demo.basketball.net", password: "mariana123", name: "Mariana Costa" },
  { uid: "usr-enrico", email: "enrico@demo.basketball.net", password: "enrico123", name: "Enrico Ceron" },
  { uid: "usr-rodrigo", email: "rodrigo@demo.basketball.net", password: "rodrigo123", name: "Rodrigo Ceron" },
];

const emulator = process.env.FIREBASE_AUTH_EMULATOR_HOST;
const projectId =
  process.env.GCLOUD_PROJECT ?? (emulator ? "demo-basketball-net" : "basketball-net");

const auth = getAuth(initializeApp({ projectId }));
console.log(`Projeto ${projectId}${emulator ? ` (emulador em ${emulator})` : ""}`);

for (const { uid, email, password, name } of DEMO_USERS) {
  const fields = { email, password, displayName: name, emailVerified: true };
  try {
    await auth.getUser(uid);
    await auth.updateUser(uid, fields);
    console.log(`  atualizado  ${email}`);
  } catch (error) {
    if (error.code !== "auth/user-not-found") throw error;
    await auth.createUser({ uid, ...fields });
    console.log(`  criado      ${email}`);
  }
}
