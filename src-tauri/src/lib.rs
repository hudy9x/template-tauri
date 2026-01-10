// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::sync::Mutex;
use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};

// Global state to store the opened file path
struct OpenedFilePath(Mutex<Option<String>>);

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_opened_file_path(state: tauri::State<OpenedFilePath>) -> Option<String> {
    state.0.lock().unwrap().clone()
}

#[tauri::command]
fn toggle_devtools(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_devtools_open() {
            let _ = window.close_devtools();
        } else {
            let _ = window.open_devtools();
        }
    }
}

#[tauri::command]
fn open_devtools(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.open_devtools();
    }
}

#[tauri::command]
fn close_devtools(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.close_devtools();
    }
}

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                .title("Transparent Titlebar Window")
                .inner_size(800.0, 600.0)
                .decorations(false)
                .transparent(true);



            let window = win_builder.build().unwrap();

            // set background color only when building for macOS
            #[cfg(target_os = "macos")]
            {
                use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

                // Apply blur effect with 10px rounded corners
                let blur = NSVisualEffectMaterial::HudWindow;
                // let blur = NSVisualEffectMaterial::FullScreenUI;

                // let blur = NSVisualEffectMaterial::Sidebar (Current, thick frosted glass)
                // let blur = NSVisualEffectMaterial::HudWindow (Darker, thinner)
                // let blur = NSVisualEffectMaterial::Menu (Thin, standard menu transparency)
                // let blur = NSVisualEffectMaterial::Popover (Similar to Menu)
                // let blur = NSVisualEffectMaterial::UnderWindowBackground (Standard window blur)
                // let blur = NSVisualEffectMaterial::UnderPageBackground (Subtle)
                // let blur = NSVisualEffectMaterial::FullScreenUI (Dark and thick)


                apply_vibrancy(&window, blur, None, Some(10.0))
                    .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            }

            // Register cleanup handler for when the app is closing
            let window = app
                .get_webview_window("main")
                .expect("Failed to get main window");
            window.on_window_event(
                move |event| {
                    if let tauri::WindowEvent::CloseRequested { .. } = event {}
                },
            );
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            get_opened_file_path,
            toggle_devtools,
            open_devtools,
            close_devtools,
            commands::files::list_dir,
            commands::files::read_file_content,
            commands::files::write_file_content,
            commands::files::create_directory,
            commands::files::create_file,
            commands::files::delete_node,
            commands::files::rename_node,
            commands::git::get_current_branch,
            commands::git::get_all_branches,
            commands::git::switch_branch,
            commands::git::get_git_status,
            commands::git::git_pull,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
