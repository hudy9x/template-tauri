import { ReactNode } from 'react';
// import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      {/* MainContent - Between Titlebar and Footer */}
      <main className="fixed top-[35px] bottom-8 h-[calc(100vh-35px-32px)] left-0 right-0 overflow-auto">
        {children}
      </main>

      {/* Footer - Fixed at Bottom */}
      {/* <Footer /> */}
    </>
  );
}