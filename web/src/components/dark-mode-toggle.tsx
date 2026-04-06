"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Toggle de dark mode. Adiciona/remove a classe .dark no <html>.
// Persistido em localStorage. Os tokens dark já existem em globals.css
// para ambos os temas (indigo.dark e basketball.dark).

type Mode = "light" | "dark";

export function DarkModeToggle() {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const saved = localStorage.getItem("eco-color-mode") as Mode | null;
    const initial =
      saved ??
      (document.documentElement.classList.contains("dark") ? "dark" : "light");
    setMode(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  function toggle() {
    const next: Mode = mode === "light" ? "dark" : "light";
    setMode(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("eco-color-mode", next);
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      className="text-toolbar-foreground/50 hover:text-toolbar-foreground"
      aria-label={mode === "light" ? "Ativar modo escuro" : "Ativar modo claro"}
    >
      {mode === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
