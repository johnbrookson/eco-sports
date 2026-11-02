import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Testes da camada de dados contra o emulador do Data Connect. Rode com
// `npm test`, que sobe o emulador, carrega os dados demo e chama o Vitest.
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\//, replacement: fileURLToPath(new URL("./src/", import.meta.url)) },
      // "server-only" só existe dentro do Next; nos testes vira módulo vazio.
      { find: "server-only", replacement: fileURLToPath(new URL("./test/server-only.ts", import.meta.url)) },
    ],
  },
  test: {
    environment: "node",
    env: { GCLOUD_PROJECT: "demo-basketball-net" },
    setupFiles: ["./test/require-emulator.ts"],
  },
});
