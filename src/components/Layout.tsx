import { ReactNode } from 'react';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  );
}