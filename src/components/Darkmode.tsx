"use client";

import { createContext, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";

type ThemeContextType = {
  dark: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  toggle: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  vibrate: (pattern?: number | number[]) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;

    const savedDark = localStorage.getItem("darkMode");
    return savedDark !== null
      ? savedDark === "true"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [highContrast, setHighContrast] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("highContrast") === "true";
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("reducedMotion") === "true";
  });

  useLayoutEffect(() => {
    document.documentElement.classList.toggle("dark-mode", dark);
    document.documentElement.classList.toggle("alto-contraste", highContrast);
    document.documentElement.classList.toggle("reduced-motion", reducedMotion);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";

    localStorage.setItem("darkMode", String(dark));
    localStorage.setItem("highContrast", String(highContrast));
    localStorage.setItem("reducedMotion", String(reducedMotion));
  }, [dark, highContrast, reducedMotion]);

  const vibrate = (pattern: number | number[] = [10]) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const value = useMemo<ThemeContextType>(
    () => ({
      dark,
      highContrast,
      reducedMotion,
      toggle: () => {
        setDark((value) => !value);
        vibrate([10, 20, 10]);
      },
      toggleHighContrast: () => {
        setHighContrast((value) => !value);
        vibrate([8, 12, 8]);
      },
      toggleReducedMotion: () => {
        setReducedMotion((value) => !value);
        vibrate([6, 10, 6]);
      },
      vibrate,
    }),
    [dark, highContrast, reducedMotion]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useDarkMode() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useDarkMode must be used within a ThemeProvider");
  }

  return context;
}

