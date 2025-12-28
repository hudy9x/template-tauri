import { TitlebarContainer } from './TitlebarContainer';
import { WindowsButtons } from './WindowsButtons';

export function WindowsTitlebar() {
  return (
    <TitlebarContainer>
      {/* Title - Centered */}
      <div data-tauri-drag-region className="flex items-center justify-center h-full px-3">
        <span className="text-[13px] font-medium text-foreground/70 pointer-events-none">UML Editor</span>
      </div>

      {/* Buttons - Absolute Right */}
      <div className="absolute right-0">
        <WindowsButtons />
      </div>
    </TitlebarContainer>
  );
}
