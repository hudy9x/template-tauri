import { useEffect, useState } from 'react';
import { platform } from '@tauri-apps/plugin-os';
import { WindowsTitlebar } from './WindowsTitlebar';
import { MacOSTitlebar } from './MacOSTitlebar';

export function Titlebar() {
  const [currentPlatform, setCurrentPlatform] = useState<string>('');

  useEffect(() => {
    const getPlatform = async () => {
      const platformName = platform();
      setCurrentPlatform(platformName);
    };

    getPlatform();
  }, []);

  // Return null while detecting platform to avoid flash
  if (!currentPlatform) {
    return null;
  }

  // Render platform-specific titlebar
  if (currentPlatform === 'macos') {
    return <MacOSTitlebar />;
  }

  // Default to Windows titlebar for Windows and Linux
  return <WindowsTitlebar />;
}
