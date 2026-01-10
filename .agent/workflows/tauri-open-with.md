---
description: Implement macOS "Open With" functionality in Tauri
---

# Tauri macOS "Open With" Implementation

This workflow guides you through implementing file association and "Open With" functionality for macOS in a Tauri application.

## Prerequisites

- Tauri v2 application
- macOS development environment

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
    "store:allow-set"
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

## Step 5: Create File Opening Module

Create `src-tauri/src/commands/file_opening.rs`:

```rust
use tauri::{Emitter, Manager};
use tauri_plugin_store::StoreExt;
use serde_json::json;

pub fn log_debug(message: &str) {
    println!("[DEBUG] {}", message);
}

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

## Step 6: Handle RunEvent::Opened

In `src-tauri/src/lib.rs`, replace `.run()` with `.build().run()`:

```rust
.build(tauri::generate_context!())
.expect("error while building tauri application")
.run(|app_handle, event| {
    match event {
        tauri::RunEvent::Opened { urls } => {
            for url in urls {
                let file_path = url.path();
                commands::file_opening::handle_file_opened(&app_handle, file_path);
            }
        }
        _ => {}
    }
});
```

## Step 7: Frontend - Read from Store

In your React component:

```typescript
import { load } from '@tauri-apps/plugin-store';
import { invoke } from '@tauri-apps/api/core';

useEffect(() => {
  const checkStoreForFile = async () => {
    const maxAttempts = 5;
    const delayMs = 500;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const store = await load('file-open.json');
        const filePath = await store.get<string>('opened_file_path');
        
        if (filePath) {
          // Read and display file content
          const content = await invoke<string>('read_file_content', { path: filePath });
          setFileContent(content);
          return;
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
      }
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  };
  
  checkStoreForFile();
}, []);
```

## Step 8: Build and Test

```bash
pnpm tauri build
```

Test by:
1. Right-clicking a `.md` file in Finder
2. Selecting "Open With" → Your App
3. File content should display

## Troubleshooting

- **ACL errors**: Ensure all store permissions are added
- **File not found**: Check retry logic and timing
- **Event not received**: Verify `RunEvent::Opened` handler is set up correctly
