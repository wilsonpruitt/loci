import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Loci · Wroot Press",
  description:
    "Each book of the Bible, its own lens. Thematic readers for books that get skipped.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f5f0e8" }}>{children}</body>
    </html>
  );
}
