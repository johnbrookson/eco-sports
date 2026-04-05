"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

// Persona switcher cosmético.
// Não muda permissões de fato — só troca a visão. Só `athlete` tem telas de
// verdade hoje; as outras redirecionam para /app/em-construcao. Quando
// outras personas forem implementadas, a ideia é que um mesmo usuário
// possa ter múltiplos papéis e alternar entre visões (ex: um coach que
// também é parent_guardian).

type Persona = {
  id: string;
  label: string;
  route: string;
  available: boolean;
};

const personas: Persona[] = [
  { id: "athlete", label: "Atleta", route: "/app/perfil", available: true },
  {
    id: "parent_guardian",
    label: "Responsável",
    route: "/app/em-construcao?persona=parent_guardian",
    available: false,
  },
  {
    id: "professional",
    label: "Profissional",
    route: "/app/em-construcao?persona=professional",
    available: false,
  },
  {
    id: "org_admin",
    label: "Clube / Organização",
    route: "/app/em-construcao?persona=org_admin",
    available: false,
  },
  {
    id: "sponsor",
    label: "Patrocinador",
    route: "/app/em-construcao?persona=sponsor",
    available: false,
  },
  {
    id: "platform_admin",
    label: "Admin da plataforma",
    route: "/app/em-construcao?persona=platform_admin",
    available: false,
  },
];

export function PersonaSwitcher({ currentRole }: { currentRole: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const current =
    personas.find((p) => p.id === currentRole) ?? personas[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold hover:border-primary transition-colors"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Visão
        </span>
        <span className="text-foreground">{current.label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-popover shadow-lg overflow-hidden">
            <div className="border-b border-border px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                Alternar visão
              </p>
            </div>
            <ul className="py-1">
              {personas.map((p) => {
                const isCurrent = p.id === current.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        router.push(p.route);
                      }}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-sm text-left hover:bg-muted transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {p.label}
                        </span>
                        {!p.available && (
                          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground border border-border rounded-full px-1.5 py-0.5">
                            em breve
                          </span>
                        )}
                      </span>
                      {isCurrent && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
