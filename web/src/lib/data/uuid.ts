// O Data Connect devolve UUIDs sem hífens ("a7b4c5d81e2f..."), mas o app
// compara ids no formato canônico ("a7b4c5d8-1e2f-..."), que é também o dos
// mocks e o que o banco aceita na entrada. Toda leitura passa por aqui.
export function canonicalUuid(id: string): string {
  const hex = id.replaceAll("-", "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(hex)) {
    throw new Error(`UUID inválido vindo do banco: ${id}`);
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
