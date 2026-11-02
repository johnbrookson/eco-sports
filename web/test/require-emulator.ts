// Os testes gravam e apagam linhas de teste no banco. Sem o emulador, o Admin
// SDK falaria com o projeto real: aborta antes.
if (!process.env.DATA_CONNECT_EMULATOR_HOST) {
  throw new Error(
    "DATA_CONNECT_EMULATOR_HOST não definido. Rode `npm test`, que sobe o emulador do Data Connect.",
  );
}
