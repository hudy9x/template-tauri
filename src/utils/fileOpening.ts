import { load } from '@tauri-apps/plugin-store';
import { invoke } from '@tauri-apps/api/core';

/**
 * Check if a file is a supported markdown file
 */
export function isMarkdownFile(filePath: string): boolean {
  return filePath.endsWith('.md') || filePath.endsWith('.markdown');
}

/**
 * Extract filename from full path
 */
export function getFileName(filePath: string): string {
  return filePath.split('/').pop() || filePath;
}

/**
 * Read file content from backend
 */
export async function readFileContent(filePath: string): Promise<string> {
  return await invoke<string>('read_file_content', { path: filePath });
}

/**
 * Check store for opened file with retry logic
 */
export async function checkStoreForFile(
  maxAttempts: number = 5,
  delayMs: number = 500
): Promise<string | null> {
  console.log('[FileOpening] Checking store for opened file...');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[FileOpening] Store check attempt ${attempt}/${maxAttempts}`);

      const store = await load('file-open.json');
      const filePath = await store.get<string>('opened_file_path');

      if (filePath) {
        console.log(`[FileOpening] SUCCESS on attempt ${attempt}: Found file path:`, filePath);
        return filePath;
      } else {
        console.log(`[FileOpening] Attempt ${attempt}: No file path in store yet`);
      }
    } catch (error) {
      console.error(`[FileOpening] Attempt ${attempt} failed:`, error);
    }

    // Wait before next attempt (except on last attempt)
    if (attempt < maxAttempts) {
      console.log(`[FileOpening] Waiting ${delayMs}ms before next attempt...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  console.log(`[FileOpening] FAILED: No file found after ${maxAttempts} attempts`);
  return null;
}

/**
 * Load and process a file if it's a markdown file
 */
export async function loadMarkdownFile(
  filePath: string,
  onLoad: (content: string, fileName: string) => void
): Promise<void> {
  if (!isMarkdownFile(filePath)) {
    console.log('[FileOpening] File is not a markdown file, ignoring');
    return;
  }

  try {
    console.log('[FileOpening] Reading markdown file...');
    const content = await readFileContent(filePath);
    const fileName = getFileName(filePath);

    console.log('[FileOpening] File loaded successfully, length:', content.length);
    onLoad(content, fileName);
  } catch (error) {
    console.error('[FileOpening] Failed to read file:', error);
    throw error;
  }
}
