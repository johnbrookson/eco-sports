import { NextResponse, type NextRequest } from "next/server";

import { SESSION_COOKIE_NAME } from "@/lib/auth/cookies";

// Proxy (ex-middleware em Next.js <= 15, renomeado no Next.js 16).
// Primeira linha de defesa: optimistic check que só olha se o cookie de sessão
// existe. Não verifica o cookie nem consulta usuários: o proxy roda num bundle
// separado, com sua própria cópia dos módulos, então não enxerga usuários
// criados em runtime (mapping in-memory) e não deve depender do Admin SDK.
// A verificação autoritativa acontece no DAL (src/lib/auth/dal.ts), e o
// redirect de quem já está logado em /login e /signup fica no (auth)/layout.

const PROTECTED_PREFIXES = ["/app"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Sem cookie de sessão tentando acessar /app/* → manda pro login,
  // preservando o destino em ?next= para redirecionar depois.
  if (!req.cookies.has(SESSION_COOKIE_NAME)) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Não rodar em assets, rotas internas do Next, nem em arquivos estáticos.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
