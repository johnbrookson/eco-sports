import { NextResponse, type NextRequest } from "next/server";

import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth/session";

// Proxy (ex-middleware em Next.js <= 15, renomeado no Next.js 16).
// Primeira linha de defesa: optimistic check que só lê o cookie de sessão.
// A verificação autoritativa de authz acontece no DAL (src/lib/auth/dal.ts),
// chamado dentro de cada Server Component / Action que toca dado sensível.

const PROTECTED_PREFIXES = ["/app"];
const AUTH_ROUTES = ["/login"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r);

  if (!isProtected && !isAuthRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decrypt(token);
  const isAuthenticated = Boolean(session?.sub);

  // Usuário sem sessão tentando acessar /app/* → manda pro login,
  // preservando o destino em ?next= para redirecionar depois.
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Usuário já logado tentando abrir /login → joga direto pro app.
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/app/perfil", req.nextUrl));
  }

  return NextResponse.next();
}

// Não rodar em assets, rotas internas do Next, nem em arquivos estáticos.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
