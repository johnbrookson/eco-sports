import { describe, expect, it } from "vitest";

import { resolveSeedTarget } from "./seed-target.mjs";

// Sem a variável do emulador, o seed:data gravaria os dados demo num projeto
// real. Só vale com --project explícito.

describe("resolveSeedTarget", () => {
  it("recusa gravar fora do emulador sem --project", () => {
    expect(() => resolveSeedTarget([], {})).toThrow(/--project basketball-net/);
  });

  it("não aceita GCLOUD_PROJECT no lugar de --project fora do emulador", () => {
    expect(() => resolveSeedTarget([], { GCLOUD_PROJECT: "basketball-net" })).toThrow(
      /--project basketball-net/,
    );
  });

  it("grava no projeto real só com --project", () => {
    expect(resolveSeedTarget(["--project", "basketball-net"], {})).toEqual({
      projectId: "basketball-net",
      emulator: undefined,
    });
    expect(resolveSeedTarget(["--project=basketball-net"], {})).toEqual({
      projectId: "basketball-net",
      emulator: undefined,
    });
  });

  it("recusa --project sem valor", () => {
    expect(() => resolveSeedTarget(["--project"], {})).toThrow(/id do projeto/);
    expect(() => resolveSeedTarget(["--project="], {})).toThrow(/id do projeto/);
  });

  it("usa o emulador quando qualquer uma das duas variáveis está definida", () => {
    expect(resolveSeedTarget([], { DATA_CONNECT_EMULATOR_HOST: "127.0.0.1:9399" })).toEqual({
      projectId: "demo-basketball-net",
      emulator: "127.0.0.1:9399",
    });
    expect(
      resolveSeedTarget([], { FIREBASE_DATA_CONNECT_EMULATOR_HOST: "http://127.0.0.1:9399" }),
    ).toEqual({ projectId: "demo-basketball-net", emulator: "127.0.0.1:9399" });
  });

  it("trata a variável vazia como ausente", () => {
    expect(() => resolveSeedTarget([], { DATA_CONNECT_EMULATOR_HOST: "" })).toThrow(
      /--project basketball-net/,
    );
  });
});
