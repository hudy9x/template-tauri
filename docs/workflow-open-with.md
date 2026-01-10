---
description: Implement macOS "Open With" functionality in Tauri
---

# Tauri macOS "Open With" Implementation

This workflow guides you through implementing file association and "Open With" functionality for macOS in a Tauri application.

## Prerequisites

- Tauri v2 application
- macOS development environment
- React with React Router

## Step 1: Install Dependencies

```bash
# Install store plugin for Rust
cd src-tauri
cargo add tauri-plugin-store

# Install store plugin for JavaScript
cd ..
pnpm add @tauri-apps/plugin-store
```

## Step 2: Configure File Associations (CRITICAL)

**This is the most important step** - without this, your app won't appear in the "Open With" dialog!

Edit `src-tauri/tauri.conf.json` and add file associations in the `bundle` section:

```json
{
  "bundle": {
    "fileAssociations": [
      {
        "ext": ["md", "markdown"],
        "name": "Markdown Document",
        "description": "Markdown text file",
        "mimeType": "text/markdown"
      }
    ]
  }
}
```

**What this does:**
- `ext`: File extensions your app can open
- `name`: Display name shown in "Open With" dialog
- `description`: Description of the file type
- `mimeType`: MIME type for the file

**Important:** After changing this, you must rebuild the app for macOS to recognize the file associations.

## Step 3: Add Store Permissions

Edit `src-tauri/capabilities/default.json` and add store permissions:

```json
{
  "permissions": [
    "store:default",
    "store:allow-load",
    "store:allow-get",
    "store:allow-set",
    "store:allow-delete"
  ]
}
```

## Step 4: Initialize Store Plugin

In `src-tauri/src/lib.rs`, add the store plugin:

```rust
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        // ... other plugins
}
```

## Step 5: Create Logging Utility

Create `src-tauri/src/utils/log.rs`:

```rust
/// Logging helper function for debugging
pub fn log_debug(message: &str) {
    println!("[DEBUG] {}", message);
    
    use std::fs::OpenOptions;
    use std::io::Write;
    if let Ok(home) = std::env::var("HOME") {
        let log_path = format!("{}/tauri_file_open_debug.log", home);
        if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(&log_path) {
            let _ = writeln!(file, "[DEBUG] {}", message);
        }
    }
}
```

Create `src-tauri/src/utils/mod.rs`:
```rust
pub mod log;
```

Add to `src-tauri/src/lib.rs`:
```rust
mod utils;
```

## Step 6: Create File Opening Module

Create `src-tauri/src/commands/file_opening.rs`:

```rust
use tauri::{Emitter, Manager};
use tauri_plugin_store::StoreExt;
use serde_json::json;
use crate::utils::log::log_debug;

pub fn is_supported_file_type(file_path: &str) -> bool {
    file_path.ends_with(".md") || file_path.ends_with(".markdown")
}

pub fn save_file_to_store(app_handle: &tauri::AppHandle, file_path: &str) {
    if let Ok(store) = app_handle.store("file-open.json") {
        store.set("opened_file_path", json!(file_path));
        log_debug(&format!("Saved: {}", file_path));
    }
}

pub fn emit_file_opened_event(app_handle: tauri::AppHandle, file_path: String) {
    std::thread::spawn(move || {
        for attempt in 1..=10 {
            if let Some(window) = app_handle.get_webview_window("main") {
                let _ = window.emit("file-opened", &file_path);
                break;
            }
            std::thread::sleep(std::time::Duration::from_millis(100));
        }
    });
}

pub fn handle_file_opened(app_handle: &tauri::AppHandle, file_path: &str) {
    if is_supported_file_type(file_path) {
        save_file_to_store(app_handle, file_path);
        emit_file_opened_event(app_handle.clone(), file_path.to_string());
    }
}
```

Add to `src-tauri/src/commands/mod.rs`:
```rust
pub mod file_opening;
```

## Step 7: Handle RunEvent::Opened

In `src-tauri/src/lib.rs`, replace `.run()` with `.build().run()`:

```rust
.build(tauri::generate_context!())
.expect("error while building tauri application")
.run(|app_handle, event| {
    match event {
        tauri::RunEvent::Opened { urls } => {
            utils::log::log_debug(&format!("RunEvent::Opened triggered with {} URLs", urls.len()));
            
            for url in urls {
                let file_path = url.path();
                commands::file_opening::handle_file_opened(&app_handle, file_path);
            }
        }
        _ => {}
    }
});
```

## Step 8: Frontend - Create File Opening Utilities

Create `src/utils/fileOpening.ts`:

```typescript
import { load } from '@tauri-apps/plugin-store';
import { invoke } from '@tauri-apps/api/core';

export function isMarkdownFile(filePath: string): boolean {
  return filePath.endsWith('.md') || filePath.endsWith('.markdown');
}

export function getFileName(filePath: string): string {
  return filePath.split('/').pop() || filePath;
}

export async function readFileContent(filePath: string): Promise<string> {
  return await invoke<string>('read_file_content', { path: filePath });
}

export async function checkStoreForFile(
  maxAttempts: number = 5,
  delayMs: number = 500
): Promise<string | null> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const store = await load('file-open.json');
      const filePath = await store.get<string>('opened_file_path');
      
      if (filePath) {
        return filePath;
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
    }
    
    if (attempt < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return null;
}

export async function loadMarkdownFile(
  filePath: string,
  onLoad: (content: string, fileName: string) => void
): Promise<void> {
  if (!isMarkdownFile(filePath)) {
    return;
  }

  const content = await readFileContent(filePath);
  const fileName = getFileName(filePath);
  onLoad(content, fileName);
}
```

## Step 9: Create ListenFileOpening Component

Create `src/components/ListenFileOpening.tsx`:

```typescript
import { useEffect } from "react";
import { checkStoreForFile } from "@/utils/fileOpening";
import { listen } from "@tauri-apps/api/event";
import { useNavigate } from "react-router-dom";
import { load } from '@tauri-apps/plugin-store';

export function ListenFileOpening() {
  const navigate = useNavigate();

  useEffect(() => {
    let unlistenFn: (() => void) | null = null;
    
    const setupListener = async () => {
      const filePath = await checkStoreForFile();
      
      if (filePath) {
        // Clear store to prevent redirect loop
        try {
          const store = await load('file-open.json');
          await store.delete('opened_file_path');
        } catch (error) {
          console.error('Failed to clear store:', error);
        }
        
        navigate('/open-with', { state: { filePath } });
      }
      
      unlistenFn = await listen<string>('file-opened', async (event) => {
        navigate('/open-with', { state: { filePath: event.payload } });
      });
    };
    
    setupListener();
    
    return () => {
      if (unlistenFn) unlistenFn();
    };
  }, [navigate]);

  return null;
}
```

## Step 10: Create OpenWith Page

Create `src/pages/OpenWith.tsx`:

```typescript
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadMarkdownFile } from "@/utils/fileOpening";

export default function OpenWith() {
  const location = useLocation();
  const navigate = useNavigate();
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const filePath = location.state?.filePath;
    
    if (!filePath) {
      setIsLoading(false);
      return;
    }

    loadMarkdownFile(filePath, (content, name) => {
      setFileContent(content);
      setFileName(name);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [location.state]);

  if (isLoading) return <div>Loading...</div>;
  if (!fileContent) return <div>No file opened</div>;

  return (
    <main className="mx-auto max-w-4xl py-10 px-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{fileName}</h1>
        <button onClick={() => navigate('/')}>Close</button>
      </div>
      
      <div className="p-6 border rounded-lg">
        <pre className="whitespace-pre-wrap">{fileContent}</pre>
      </div>
    </main>
  );
}
```

## Step 11: Update App.tsx

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OpenWith from './pages/OpenWith';
import { ListenFileOpening } from './components/ListenFileOpening';

function App() {
  return (
    <BrowserRouter>
      <ListenFileOpening />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/open-with" element={<OpenWith />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Step 12: Build and Test

```bash
pnpm tauri build
```

**Test:**
1. Right-click a `.md` file in Finder
2. Select "Open With" → Your App
3. File should open and display in the app
4. Press back button - should return to home without redirect loop

## Troubleshooting

- **ACL errors**: Ensure all store permissions are added
- **File not found**: Check retry logic timing
- **Redirect loop**: Verify store is cleared after navigation
- **Event not received**: Check `RunEvent::Opened` handler setup
