import { TitlebarContainer } from './TitlebarContainer';
import { WindowsButtons } from './WindowsButtons';

export function WindowsTitlebar() {
  return (
    <TitlebarContainer>
      <div data-tauri-drag-region className="flex-1 flex items-center h-full px-3">
        <span className="text-[13px] font-medium text-foreground/70">UML Editor</span>
      </div>
      <WindowsButtons />
    </TitlebarContainer>
  );
}
