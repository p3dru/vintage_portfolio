"use client";

import { useSyncExternalStore } from "react";

// O tema vive no atributo data-theme do <html> (aplicado antes da pintura pelo layout).
export type Theme = "light" | "dark";

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};
const read = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // Sem storage (modo privado): o tema vale só para esta visita.
    }
  };
  return { theme, toggleTheme };
}

export function ThemeButton({
  className,
  toDark,
  toLight,
}: {
  className: string;
  toDark: string;
  toLight: string;
}) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className={className} type="button" onClick={toggleTheme}>
      {theme === "light" ? toDark : toLight}
    </button>
  );
}
