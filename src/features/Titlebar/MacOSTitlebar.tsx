import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X } from 'lucide-react';

export function MacOSTitlebar() {
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
    <div className="titlebar macos-titlebar">
      <div className="titlebar-left">
        <div className="titlebar-controls">
          <button
            className="titlebar-button macos-close"
            onClick={handleClose}
            title="Close"
            aria-label="Close window"
          >
            <X size={10} strokeWidth={2.5} />
          </button>
          <button
            className="titlebar-button macos-minimize"
            onClick={handleMinimize}
            title="Minimize"
            aria-label="Minimize window"
          >
            <Minus size={10} strokeWidth={2.5} />
          </button>
          <button
            className="titlebar-button macos-maximize"
            onClick={handleMaximize}
            title="Maximize"
            aria-label="Maximize window"
          >
            <Square size={8} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      <div data-tauri-drag-region className="titlebar-drag-region">
        <span className="titlebar-title">UML Editor</span>
      </div>
      <div className="titlebar-right"></div>
    </div>
  );
}
