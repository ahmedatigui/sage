import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './markdownStyles.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sage: ',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <base target="_blank" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
