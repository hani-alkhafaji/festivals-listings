"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const SearchContext = createContext<{
  cityQuery: string;
  setCityQuery: (v: string) => void;
} | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [cityQuery, setCityQuery] = useState("");
  return (
    <SearchContext.Provider value={{ cityQuery, setCityQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useCitySearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useCitySearch must be used within SearchProvider");
  return ctx;
}
