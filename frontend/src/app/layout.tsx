import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bethex on BOT Chain',
  description: 'Launch quickly, securely, and efficiently on BOT Chain Mainnet.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
