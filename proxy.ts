import { NextResponse, type NextRequest } from "next/server";

// Rotas sem prefixo de idioma vão para /pt ou /en conforme o idioma preferido do navegador.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (/^\/(pt|en)(\/|$)/.test(pathname)) return;

  const preferred = request.headers.get("accept-language")?.split(",")[0]?.trim() ?? "";
  const lang = preferred === "" || /^pt\b/i.test(preferred) ? "pt" : "en";

  request.nextUrl.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Ignora internos do Next, as funções em /api e arquivos estáticos (caminhos com extensão).
  matcher: ["/((?!_next|api/|.*\\..*).*)"],
};
