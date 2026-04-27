import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "eLearning Platform",
  description: "Plateforme d'apprentissage en ligne",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}