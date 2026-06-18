"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type ThemeType = "BUS" | "METRO" | "MODERN" | "AIRPLANE";

interface ThemeConfig {
  background: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  textAccentSecondary: string;
  border: string;
  font: string;
  glow: string;
  accentGlow: string;
  sidebarColor?: string; // Optional property for the side blocks
}

const THEMES: Record<ThemeType, ThemeConfig> = {
  MODERN: {
    background: "bg-[#eef2f6]",
    cardBg: "bg-white/30 backdrop-blur-[40px] shadow-[0_8px_32px_rgba(34,211,238,0.15)] border border-white/50",
    textPrimary: "text-slate-800",
    textSecondary: "text-slate-600",
    textAccent: "text-cyan-600",
    textAccentSecondary: "text-blue-600",
    border: "border-white/50 border",
    font: "font-sans",
    glow: "",
    accentGlow: ""
  },
  BUS: {
    background: "bg-gray-100",
    cardBg: "bg-white shadow-md",
    textPrimary: "text-black",
    textSecondary: "text-gray-700",
    textAccent: "text-black",
    textAccentSecondary: "text-black",
    border: "border-b border-gray-200", // Separators between rows
    font: "font-sans",
    glow: "",
    accentGlow: "",
    sidebarColor: "bg-[#D61F26]" // ADO Red
  },
  METRO: {
    background: "bg-black",
    cardBg: "bg-[#0a0a0a]",
    textPrimary: "text-white font-semibold",
    textSecondary: "text-gray-300",
    textAccent: "text-white",
    textAccentSecondary: "text-white",
    border: "border-b border-gray-800", // Separators
    font: "font-sans",
    glow: "",
    accentGlow: "",
    sidebarColor: "bg-[#5880D5]" // Flinders Blue
  },
  AIRPLANE: {
    background: "bg-[#111]",
    cardBg: "bg-black",
    textPrimary: "text-gray-300",
    textSecondary: "text-gray-400",
    textAccent: "text-yellow-400",
    textAccentSecondary: "text-orange-500",
    border: "border-[#222] border-2",
    font: "font-mono uppercase", 
    glow: "",
    accentGlow: ""
  }
};

interface ThemeContextProps {
  themeName: ThemeType;
  theme: ThemeConfig;
  setTheme: (t: ThemeType) => void;
  is24Hour: boolean;
  setIs24Hour: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeType>("MODERN");
  const [is24Hour, setIs24Hour] = useState(true);

  return (
    <ThemeContext.Provider value={{ themeName, theme: THEMES[themeName], setTheme: setThemeName, is24Hour, setIs24Hour }}>
      <div className={`${THEMES[themeName].background} ${THEMES[themeName].font} min-h-screen transition-colors duration-500`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
