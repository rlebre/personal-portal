import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Rui Lebre',
  description: 'Personal website of Rui Lebre - software engineer.',
  viewport: 'width=device-width, initial-scale=1.0',
  icons: 'logo.svg',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
