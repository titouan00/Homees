import type { Metadata } from "next";
import { inter } from '@/app/ui/fonts';
import '@/app/globals.css';
import ConditionalLayout from "@/components/ConditionalLayout";


export const metadata: Metadata = {
  title: "Homees - Comparateur de gestionnaires immobiliers",
  description: "Trouvez le meilleur gestionnaire pour vos biens immobiliers avec Homees, la plateforme de mise en relation entre propriétaires et gestionnaires certifiés.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.className} antialiased min-h-screen flex flex-col`}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
