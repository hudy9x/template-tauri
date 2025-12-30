import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X } from 'lucide-react';

export function WindowsButtons() {
  const appWindow = getCurrentWindow();

  const handleMinimize = () => {
    appWindow.minimize();
  };

  const handleMaximize = () => {
    appWindow.toggleMaximize();
  };

  const handleClose = () => {
    appWindow.close();
  };

  return (
    <div className="flex h-full">
      <button
        onClick={handleMinimize}
        title="Minimize"
        aria-label="Minimize window"
        className="cursor-pointer w-[46px] h-full flex items-center justify-center text-foreground hover:bg-accent transition-colors"
      >
        <Minus size={16} />
      </button>
      <button
        onClick={handleMaximize}
        title="Maximize"
        aria-label="Maximize window"
        className="cursor-pointer w-[46px] h-full flex items-center justify-center text-foreground hover:bg-accent transition-colors"
      >
        <Square size={14} />
      </button>
      <button
        onClick={handleClose}
        title="Close"
        aria-label="Close window"
        className="cursor-pointer w-[46px] h-full flex items-center justify-center text-foreground hover:bg-[#e81123] hover:text-white active:bg-[#c50f1f] transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}
