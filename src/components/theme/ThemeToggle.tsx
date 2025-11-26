"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Carrega tema salvo
  useEffect(() => {
    const saved = window.localStorage.getItem("vf-theme") as "dark" | "light" | null;
    const initial = saved ?? "dark";
    setTheme(initial);

    document.documentElement.classList.remove("light-theme", "dark-theme");
    document.documentElement.classList.add(initial === "dark" ? "dark-theme" : "light-theme");
  }, []);

  // Alterna tema
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem("vf-theme", next);

    document.documentElement.classList.remove("light-theme", "dark-theme");
    document.documentElement.classList.add(next === "dark" ? "dark-theme" : "light-theme");
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        inline-flex items-center gap-2
        rounded-full border border-[color:var(--border-subtle)]
        bg-[color:var(--bg-card)]
        px-3 py-1.5 text-xs md:text-sm
        text-[color:var(--text-soft)]
        hover:text-[color:var(--text)]
        hover:border-[color:var(--accent)]
        transition-all
      "
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4" />
          <span>Modo claro</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          <span>Modo escuro</span>
        </>
      )}
    </button>
  );
}
