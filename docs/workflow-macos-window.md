# Feature Showcase: macOS Window Customization

This guide details the implementation of a custom macOS window with:
- **Semi-transparent blue background**
- **Blur effect (Vibrancy)**
- **Hidden native titlebar**
- **Rounded corners (10px)**
- **Native Drop Shadow**

![Feature Preview](./macos-window-preview.png)

## Implementation Details

### 1. Dependencies

Added to `src-tauri/Cargo.toml`:
```toml
[target."cfg(target_os = \"macos\")".dependencies]
cocoa = "0.26"
window-vibrancy = "0.7.1"
```

### 2. Window Configuration (Rust)

In `src-tauri/src/lib.rs`, the window is created programmatically to allow for simpler configuration management.

**Key Settings:**
- `.decorations(false)`: Removes the native titlebar and window border.
- `.transparent(true)`: Enables transparency support.
- `.shadow(true)`: Requests standard shadow (often insufficient for borderless).

### 3. macOS Specific Logic

We use `window-vibrancy` for the blur effect and `cocoa` crate for accessing native APIs to handle the shadow correctly.

```rust
#[cfg(target_os = "macos")]
{
    use cocoa::appkit::NSWindow;
    use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

    // Apply blur effect (HudWindow, Sidebar, etc.) with rounded corners
    let blur = NSVisualEffectMaterial::HudWindow;
    apply_vibrancy(&window, blur, None, Some(10.0))
        .expect("Unsupported platform!");

    // Force native shadow using Cocoa APIs
    let ns_window = window.ns_window().unwrap() as cocoa::base::id;
    unsafe {
        ns_window.setHasShadow_(true);
        ns_window.invalidateShadow();
    }
}
```

### 4. Frontend Styling

The window background color is handled in CSS `src/App.css` to ensure it respects the rounded corners.

```css
html,
body {
  border-radius: 10px; /* Matching the 10.0 radius in Rust */
  background: transparent; /* Or rgba(0, 0, 255, 0.5) for tint */
  overflow: hidden; /* Ensures content doesn't bleed out */
}
```

## Why this approach?

- **Native Blur:** `window-vibrancy` provides much better performance and aesthetics than CSS blur.
- **Native Shadow:** Borderless windows often lose their shadow on macOS. Forcing it via Cocoa APIs ensures the window looks like a native desktop app.
- **Programmatic Control:** Creating the window in Rust gives us access to the window handle immediately for applying effects.
