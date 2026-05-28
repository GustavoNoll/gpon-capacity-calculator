import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GPON Capacity Calculator',
  description:
    'Estimate GPON thread capacity for bulk, massives, OLT routines, SAC, API and provisioning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
