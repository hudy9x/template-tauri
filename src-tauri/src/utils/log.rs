/// Logging helper function for debugging
/// Writes to both stdout and a debug log file
pub fn log_debug(message: &str) {
    println!("[DEBUG] {}", message);
    
    // Also write to file for debugging
    use std::fs::OpenOptions;
    use std::io::Write;
    if let Ok(home) = std::env::var("HOME") {
        let log_path = format!("{}/tauri_file_open_debug.log", home);
        if let Ok(mut file) = OpenOptions::new().create(true).append(true).open(&log_path) {
            let _ = writeln!(file, "[DEBUG] {}", message);
        }
    }
}
