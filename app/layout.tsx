import type { Metadata } from 'next';
import { Inter, Syne, Outfit, Fira_Code } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'VAULT — AI Saving Coach',
  description: 'Elite AI-powered personal saving coach for Ugandan users.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${syne.variable} ${firaCode.variable}`}>
      <body suppressHydrationWarning className="bg-background text-text overflow-x-hidden min-h-screen">
        <AppProvider>
          <div className="blob blob-primary" />
          <div className="blob blob-secondary" />
          <div className="bg-grid absolute inset-0 z-[-2] opacity-50" />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
