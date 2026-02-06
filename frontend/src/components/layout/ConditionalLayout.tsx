'use client';

import { usePathname } from 'next/navigation';
import Navigationbar from './Navigationbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Navigationbar />}
      <main className="">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}
