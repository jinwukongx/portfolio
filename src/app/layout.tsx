// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { ClientShell } from './ClientShell';

export const metadata: Metadata = {
  title: 'Divine Amakor — Full-Stack Engineer',
  description: 'Portfolio of Divine Amakor, Full-Stack Engineer specialising in MERN stack and machine learning.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
