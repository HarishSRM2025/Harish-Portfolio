"use client";

import { useEffect } from "react";

export default function ThemeProvider({ children, defaultTheme = "dark" }) {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem("portfolio-theme") || defaultTheme || "dark";
    const storedColor = window.localStorage.getItem("portfolio-color") || "indigo";
    const root = document.documentElement;

    root.classList.toggle("dark", storedTheme === "dark");
    root.setAttribute("data-theme", storedTheme);
    root.setAttribute("data-color", storedColor);
  }, [defaultTheme]);

  return <>{children}</>;
}
