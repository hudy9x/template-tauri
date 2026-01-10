use tauri::{Emitter, Manager};
use tauri_plugin_store::StoreExt;
use serde_json::json;
use crate::utils::log::log_debug;

/// Check if a file type is supported for opening
pub fn is_supported_file_type(file_path: &str) -> bool {
    file_path.ends_with(".pu") 
        || file_path.ends_with(".puml")
        || file_path.ends_with(".md")
        || file_path.ends_with(".markdown")
}

/// Save opened file path to store for frontend retrieval
pub fn save_file_to_store(app_handle: &tauri::AppHandle, file_path: &str) {
    log_debug("Saving file path to store");
    
    if let Ok(store) = app_handle.store("file-open.json") {
        store.set("opened_file_path", json!(file_path));
        log_debug(&format!("Store updated with file path: {}", file_path));
    } else {
        log_debug("ERROR: Could not get store!");
    }
}

/// Emit file-opened event to frontend with retry logic for window availability
pub fn emit_file_opened_event(app_handle: tauri::AppHandle, file_path: String) {
    std::thread::spawn(move || {
        for attempt in 1..=10 {
            if let Some(window) = app_handle.get_webview_window("main") {
                let _ = window.emit("file-opened", &file_path);
                log_debug(&format!("Event emitted on attempt {}", attempt));
                break;
            } else {
                std::thread::sleep(std::time::Duration::from_millis(100));
            }
        }
    });
}

/// Handle file opening from RunEvent::Opened (macOS "Open With")
pub fn handle_file_opened(app_handle: &tauri::AppHandle, file_path: &str) {
    log_debug(&format!("Processing file: {}", file_path));
    
    if is_supported_file_type(file_path) {
        log_debug("File type is supported");
        save_file_to_store(app_handle, file_path);
        emit_file_opened_event(app_handle.clone(), file_path.to_string());
    } else {
        log_debug(&format!("File type NOT supported: {}", file_path));
    }
}
