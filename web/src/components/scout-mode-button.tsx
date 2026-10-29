"use client";

import { Printer } from "lucide-react";

// Scout Mode (vindo do site do EC): abre a impressão do navegador com a ficha
// limpa do atleta, que pode ser salva como PDF. O que não entra na ficha usa
// `print:hidden`, e as cores de papel vêm do @media print em globals.css.
export function ScoutModeButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 self-start rounded-full border border-primary px-5 py-3 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary hover:text-primary-foreground md:self-auto print:hidden"
    >
      <Printer className="h-4 w-4" />
      Scout Mode
    </button>
  );
}
