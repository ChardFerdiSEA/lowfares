import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'LowFares | Compare Philippine Airlines, Cebu Pacific & AirAsia',
  description: 'Find the lowest flight fare across Philippine Airlines, Cebu Pacific, and AirAsia side by side. Skip the tabs and book direct.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 antialiased selection:bg-brand-500 selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
