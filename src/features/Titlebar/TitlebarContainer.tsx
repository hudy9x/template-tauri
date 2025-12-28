import { ReactNode } from 'react';

interface TitlebarContainerProps {
  children: ReactNode;
}

export function TitlebarContainer({ children }: TitlebarContainerProps) {
  return (
    <div data-tauri-drag-region className="fixed top-0 left-0 right-0 h-[35px] flex items-center justify-center select-none z-[9999] bg-background backdrop-blur-[40px] border-b border-muted-foreground/30 relative">
      {children}
    </div>
  );
}
