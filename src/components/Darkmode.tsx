"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";

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
  const [dark, setDark] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync with localStorage and system preferences after hydration
  useEffect(() => {
    const savedDark = localStorage.getItem("darkMode");
    const savedHighContrast = localStorage.getItem("highContrast");
    const savedReducedMotion = localStorage.getItem("reducedMotion");

    setDark(
      savedDark !== null
        ? savedDark === "true"
        : window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    setHighContrast(savedHighContrast === "true");
    setReducedMotion(savedReducedMotion === "true");
    setIsHydrated(true);
  }, []);

  useLayoutEffect(() => {
    if (!isHydrated) return;

    document.documentElement.classList.toggle("dark-mode", dark);
    document.documentElement.classList.toggle("alto-contraste", highContrast);
    document.documentElement.classList.toggle("reduced-motion", reducedMotion);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";

    localStorage.setItem("darkMode", String(dark));
    localStorage.setItem("highContrast", String(highContrast));
    localStorage.setItem("reducedMotion", String(reducedMotion));
  }, [dark, highContrast, reducedMotion, isHydrated]);

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

