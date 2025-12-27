import { TitlebarContainer } from './TitlebarContainer';
import { MacOSButtons } from './MacOSButtons';

export function MacOSTitlebar() {
  return (
    <TitlebarContainer>
      <div className="flex items-center gap-3 pl-3">
        <MacOSButtons />
      </div>
      <div data-tauri-drag-region className="flex-1 flex items-center justify-center h-full px-3">
        <span className="text-[13px] font-medium text-foreground/70">UML Editor</span>
      </div>
    </TitlebarContainer>
  );
}
