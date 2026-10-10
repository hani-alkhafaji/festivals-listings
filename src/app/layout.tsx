import type { Metadata } from "next";
import "./globals.css";
import { SearchProvider } from "@/components/SearchContext";

export const metadata: Metadata = {
  title: "European Dance Festivals",
  description: "Festival listings across European cities",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SearchProvider>{children}</SearchProvider>
      </body>
    </html>
  );
}
