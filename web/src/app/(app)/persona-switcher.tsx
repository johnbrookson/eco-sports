"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

// Persona switcher role-aware.
// Mostra como disponível apenas os roles que o user realmente possui.
// Ao trocar, seta cookie eco-sports-persona e navega pro dashboard.

const PERSONA_LABELS: Record<string, string> = {
  athlete: "Atleta",
  parent_guardian: "Responsável",
  professional: "Profissional",
  org_admin: "Clube / Organização",
  sponsor: "Patrocinador",
  platform_admin: "Admin da plataforma",
};

const PERSONA_ORDER = [
  "athlete",
  "parent_guardian",
  "professional",
  "org_admin",
  "sponsor",
  "platform_admin",
];

function setPersonaCookie(persona: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `eco-sports-persona=${persona};path=/;expires=${expires};samesite=lax`;
}

interface PersonaSwitcherProps {
  currentPersona: string;
  userRoles: string[];
}

export function PersonaSwitcher({
  currentPersona,
  userRoles,
}: PersonaSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentLabel = PERSONA_LABELS[currentPersona] ?? currentPersona;

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
        <span className="text-foreground">{currentLabel}</span>
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
              {PERSONA_ORDER.map((id) => {
                const isCurrent = id === currentPersona;
                const hasRole = userRoles.includes(id);
                const label = PERSONA_LABELS[id] ?? id;
                return (
                  <li key={id}>
                    <button
                      type="button"
                      disabled={!hasRole}
                      onClick={() => {
                        if (!hasRole) return;
                        setOpen(false);
                        setPersonaCookie(id);
                        router.push("/app");
                        router.refresh();
                      }}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-sm text-left hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {label}
                        </span>
                        {!hasRole && (
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
