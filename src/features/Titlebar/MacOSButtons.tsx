import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function MacOSButtons() {
  const appWindow = getCurrentWindow();
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    const unlisten = appWindow.onFocusChanged(({ payload: focused }) => {
      setIsFocused(focused);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, [appWindow]);

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
    <div className="flex items-center gap-2 group">
      <button
        onClick={handleClose}
        title="Close"
        aria-label="Close window"
        className={`cursor-pointer w-3 h-3 rounded-full border-[0.5px] border-black/[0.04] flex items-center justify-center relative hover:brightness-95 transition-colors ${isFocused ? 'bg-[#ff5f57]' : 'bg-primary/30'
          }`}
      >
        <X size={10} strokeWidth={2.5} className="text-[#4d0000] opacity-0 group-hover:opacity-100 transition-opacity absolute" />
      </button>
      <button
        onClick={handleMinimize}
        title="Minimize"
        aria-label="Minimize window"
        className={`cursor-pointer w-3 h-3 rounded-full border-[0.5px] border-black/[0.04] flex items-center justify-center relative hover:brightness-95 transition-colors ${isFocused ? 'bg-[#ffbd2e]' : 'bg-primary/30'
          }`}
      >
        <Minus size={10} strokeWidth={2.5} className="text-[#6b4600] opacity-0 group-hover:opacity-100 transition-opacity absolute" />
      </button>
      <button
        onClick={handleMaximize}
        title="Maximize"
        aria-label="Maximize window"
        className={`cursor-pointer w-3 h-3 rounded-full border-[0.5px] border-black/[0.04] flex items-center justify-center relative hover:brightness-95 transition-colors ${isFocused ? 'bg-[#28c840]' : 'bg-primary/30'
          }`}
      >
        <Square size={8} strokeWidth={2.5} className="text-[#004d0f] opacity-0 group-hover:opacity-100 transition-opacity absolute" />
      </button>
    </div>
  );
}
