import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drezzdon",
  description: "",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/gbz7zcs.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
