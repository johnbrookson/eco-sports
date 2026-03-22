"use client";

import { useEffect, useState } from "react";

const themes = [
  { id: "indigo", label: "Indigo", color: "bg-indigo-500" },
  { id: "basketball", label: "Basketball", color: "bg-orange-500" },
] as const;

type ThemeId = (typeof themes)[number]["id"];

export function ThemeSwitcher({ variant = "floating" }: { variant?: "floating" | "inline" }) {
  const [current, setCurrent] = useState<ThemeId>("basketball");

  useEffect(() => {
    const saved = localStorage.getItem("eco-theme") as ThemeId | null;
    const initial =
      saved ??
      (document.documentElement.getAttribute("data-theme") as ThemeId) ??
      "basketball";
    setCurrent(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function switchTheme(id: ThemeId) {
    setCurrent(id);
    document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem("eco-theme", id);
  }

  if (variant === "inline") {
    return (
      <div className="hidden md:flex items-center gap-1.5">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => switchTheme(t.id)}
            className={`h-5 w-5 rounded-full ${t.color} transition-all ${
              current === t.id
                ? "ring-2 ring-offset-1 ring-current scale-110"
                : "opacity-40 hover:opacity-70"
            }`}
            title={t.label}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-card border shadow-lg px-4 py-2">
      <span className="text-xs font-medium text-muted-foreground mr-1">
        Tema:
      </span>
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => switchTheme(t.id)}
          className={`h-6 w-6 rounded-full ${t.color} transition-all ${
            current === t.id
              ? "ring-2 ring-offset-2 ring-foreground scale-110"
              : "opacity-50 hover:opacity-80"
          }`}
          title={t.label}
        />
      ))}
    </div>
  );
}
