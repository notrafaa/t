import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Controlled AV Supervision",
  description: "Visible, consent-based audiovisual supervision for controlled productions."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
