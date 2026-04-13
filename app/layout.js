import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Decision OS — AI Revenue & Pricing Intelligence',
  description: 'Enterprise-grade AI Revenue & Pricing Intelligence System for FMCG decision-making.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
