import { useEffect } from "react";
import { checkStoreForFile } from "@/utils/fileOpening";
import { listen } from "@tauri-apps/api/event";
import { useNavigate } from "react-router-dom";
import { load } from '@tauri-apps/plugin-store';

export function ListenFileOpening() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('[ListenFileOpening] Setting up file-opened event listener');

    let unlistenFn: (() => void) | null = null;

    const setupListener = async () => {
      // Check for opened file using store with retry logic
      const filePath = await checkStoreForFile();

      if (filePath) {
        console.log('[ListenFileOpening] File found, navigating to /open-with');

        // Clear the store to prevent redirect loop when using back button
        try {
          const store = await load('file-open.json');
          await store.delete('opened_file_path');
          console.log('[ListenFileOpening] Cleared file path from store');
        } catch (error) {
          console.error('[ListenFileOpening] Failed to clear store:', error);
        }

        navigate('/open-with', { state: { filePath } });
      }

      // Listen for file-opened events from the backend
      console.log('[ListenFileOpening] Registering file-opened event listener...');
      unlistenFn = await listen<string>('file-opened', async (event) => {
        console.log('[ListenFileOpening] Received file-opened event:', event);
        const filePath = event.payload;

        console.log('[ListenFileOpening] Navigating to /open-with');
        navigate('/open-with', { state: { filePath } });
      });
      console.log('[ListenFileOpening] Event listener registered successfully');
    };

    setupListener();

    // Cleanup listener on unmount
    return () => {
      console.log('[ListenFileOpening] Cleaning up file-opened event listener');
      if (unlistenFn) {
        unlistenFn();
      }
    };
  }, [navigate]);

  return null; // This component doesn't render anything
}
