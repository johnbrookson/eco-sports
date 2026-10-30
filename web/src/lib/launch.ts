// Chave de lançamento. Com NEXT_PUBLIC_COMING_SOON=true (definido no
// web/apphosting.yaml), a home vira a página "Em breve", os links de Entrar e
// Cadastrar somem da navegação e o site pede para não ser indexado. As rotas
// continuam acessíveis por URL direta, para a equipe testar.
// NEXT_PUBLIC_ porque o valor é embutido no build e também é lido em Client
// Components (mobile-nav).

export const COMING_SOON = process.env.NEXT_PUBLIC_COMING_SOON === "true";
