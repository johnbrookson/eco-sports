// Para onde o `seed:data` grava: o emulador ou um projeto real.
//
// Com o emulador, vale a variável do shell: a CLI lê
// FIREBASE_DATA_CONNECT_EMULATOR_HOST; o Admin SDK (o app), a
// DATA_CONNECT_EMULATOR_HOST. Qualquer uma das duas aponta o seed para o
// emulador. O `emulators:exec` exporta o endereço com "http://", que o
// `dataconnect:execute` não aceita: fica só host:porta.
//
// Sem emulador, o destino é um projeto real, e o seed sobrescreve os atletas
// demo com os mocks. Por isso o projeto precisa vir explícito em --project: a
// variável do emulador posta só no .env.local não chega a este script, e
// esquecê-la não pode gravar em produção.

const USAGE =
  "Sem emulador, o seed grava num projeto real e sobrescreve os atletas demo. " +
  "Para o emulador, defina DATA_CONNECT_EMULATOR_HOST=127.0.0.1:9399 no shell; " +
  "para o projeto real, rode `npm run seed:data -- --project basketball-net`.";

function projectFlag(argv) {
  const inline = argv.find((arg) => arg.startsWith("--project="));
  if (inline) return inline.slice("--project=".length) || null;
  const i = argv.indexOf("--project");
  if (i < 0) return undefined;
  const value = argv[i + 1];
  return value && !value.startsWith("-") ? value : null;
}

/**
 * @param {string[]} argv argumentos depois do nome do script
 * @param {Record<string, string | undefined>} env
 * @returns {{ projectId: string, emulator: string | undefined }}
 */
export function resolveSeedTarget(argv, env) {
  const flag = projectFlag(argv);
  if (flag === null) throw new Error("--project precisa do id do projeto.");

  const emulator =
    (env.FIREBASE_DATA_CONNECT_EMULATOR_HOST || env.DATA_CONNECT_EMULATOR_HOST)?.replace(
      /^https?:\/\//,
      "",
    ) || undefined;
  if (emulator) {
    return { projectId: flag ?? env.GCLOUD_PROJECT ?? "demo-basketball-net", emulator };
  }

  if (!flag) throw new Error(USAGE);
  return { projectId: flag, emulator: undefined };
}
