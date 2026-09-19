"use client";

import React, { createContext, useContext, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// NOTE: The public storefront is intentionally light-only and does not expose
// a theme toggle anywhere in its UI. The admin panel has its own independent
// dark mode implementation (see adminStore's isDarkMode/toggleDarkMode) which
// manages the "dark" class on <html> directly. This provider must NOT touch
// document.documentElement's classList - doing so previously clobbered the
// admin panel's dark mode on every render/reload.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [resolvedTheme] = useState<"light" | "dark">("light");

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
