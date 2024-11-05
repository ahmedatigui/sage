import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './markdownStyles.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sage: Chat with AI',
  description:
    'An intuitive and easy-to-use interface makes it simple for users to ask questions, seek advice, or explore topics of interest.',
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
