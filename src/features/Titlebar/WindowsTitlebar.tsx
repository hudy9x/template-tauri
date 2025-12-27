import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X } from 'lucide-react';

export function WindowsTitlebar() {
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
    <div className="titlebar windows-titlebar">
      <div data-tauri-drag-region className="titlebar-drag-region">
        <span className="titlebar-title">UML Editor</span>
      </div>
      <div className="titlebar-controls">
        <button
          className="titlebar-button"
          onClick={handleMinimize}
          title="Minimize"
          aria-label="Minimize window"
        >
          <Minus size={16} />
        </button>
        <button
          className="titlebar-button"
          onClick={handleMaximize}
          title="Maximize"
          aria-label="Maximize window"
        >
          <Square size={14} />
        </button>
        <button
          className="titlebar-button titlebar-close"
          onClick={handleClose}
          title="Close"
          aria-label="Close window"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
