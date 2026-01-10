---
description: Create custom Titlebar in Tauri
---

# Tauri Custom Titlebar Implementation

This workflow guides you through implementing a custom titlebar for Tauri applications with window controls (minimize, maximize, close).

## Prerequisites

- Tauri v2 application
- React with TypeScript
- macOS development environment (for macOS-specific features)

## Step 1: Add macOS Private API Feature

Edit `src-tauri/Cargo.toml` and add the `macos-private-api` feature:

```toml
[dependencies]
tauri = { version = "2", features = ["macos-private-api"] }
```

**Why this is needed:** The `macos-private-api` feature is required for proper titlebar functionality on macOS.

## Step 2: Configure Tauri Window Settings

Edit `src-tauri/tauri.conf.json` and configure window decorations:

```json
{
  "app": {
    "windows": [
      {
        "decorations": false,
        "transparent": true,
        "shadow": true
      }
    ]
  }
}
```

**What each setting does:**
- `decorations: false` - Removes native window decorations (required for custom titlebar)
- `transparent: true` - Enables transparency for custom styling
- `shadow: true` - Maintains native window shadow

## Step 3: Add Window Control Permissions

Edit `src-tauri/capabilities/default.json` and add window control permissions:

```json
{
  "permissions": [
    "core:window:allow-close",
    "core:window:allow-minimize",
    "core:window:allow-toggle-maximize",
    "core:window:allow-start-dragging"
  ]
}
```

## Step 4: Create Titlebar Container Component

Create `src/features/Titlebar/TitlebarContainer.tsx`:

```tsx
import { ReactNode } from 'react';

interface TitlebarContainerProps {
  children: ReactNode;
}

export function TitlebarContainer({ children }: TitlebarContainerProps) {
  return (
    <div data-tauri-drag-region>
      {children}
    </div>
  );
}
```

**Critical:** The `data-tauri-drag-region` attribute enables window dragging by clicking this element.

## Step 5: Create Window Control Buttons

Create `src/features/Titlebar/WindowButtons.tsx`:

```tsx
import { getCurrentWindow } from '@tauri-apps/api/window';

export function WindowButtons() {
  const appWindow = getCurrentWindow();

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
    <div>
      <button onClick={handleMinimize}>Minimize</button>
      <button onClick={handleMaximize}>Maximize</button>
      <button onClick={handleClose}>Close</button>
    </div>
  );
}
```

**Important:** Button elements should NOT have `data-tauri-drag-region` attribute, otherwise they won't be clickable.

## Step 6: Create macOS-Style Buttons (Optional)

For macOS-style traffic light buttons, create `src/features/Titlebar/MacOSButtons.tsx`:

```tsx
import { getCurrentWindow } from '@tauri-apps/api/window';

export function MacOSButtons() {
  const appWindow = getCurrentWindow();

  return (
    <div className="titlebar-buttons">
      <button
        className="titlebar-button close"
        onClick={() => appWindow.close()}
        aria-label="Close"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      
      <button
        className="titlebar-button minimize"
        onClick={() => appWindow.minimize()}
        aria-label="Minimize"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M2 6 L10 6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      
      <button
        className="titlebar-button maximize"
        onClick={() => appWindow.toggleMaximize()}
        aria-label="Maximize"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M3 3 L9 3 L9 9 L3 9 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      </button>
    </div>
  );
}
```

## Step 7: Create Main Titlebar Component

Create `src/features/Titlebar/index.tsx`:

```tsx
import { TitlebarContainer } from './TitlebarContainer';
import { MacOSButtons } from './MacOSButtons';
// or import { WindowButtons } from './WindowButtons';

export function Titlebar() {
  return (
    <TitlebarContainer>
      <div className="titlebar-content">
        <MacOSButtons />
        <div className="titlebar-title">
          <span>App Title</span>
        </div>
      </div>
    </TitlebarContainer>
  );
}
```

## Step 8: Create Titlebar Styles

Create `src/features/Titlebar/titlebar.css`:

```css
.titlebar-content {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 12px;
  background: transparent;
  user-select: none;
}

.titlebar-buttons {
  display: flex;
  gap: 8px;
}

.titlebar-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.titlebar-button svg {
  opacity: 0;
  transition: opacity 0.2s;
}

.titlebar-content:hover .titlebar-button svg {
  opacity: 1;
}

.titlebar-button.close {
  background-color: #ff5f57;
}

.titlebar-button.close:hover {
  background-color: #ff3b30;
}

.titlebar-button.minimize {
  background-color: #ffbd2e;
}

.titlebar-button.minimize:hover {
  background-color: #ff9500;
}

.titlebar-button.maximize {
  background-color: #28c840;
}

.titlebar-button.maximize:hover {
  background-color: #00c400;
}

.titlebar-button svg {
  color: rgba(0, 0, 0, 0.7);
}

.titlebar-title {
  flex: 1;
  text-align: center;
  font-size: 13px;
  font-weight: 500;
  pointer-events: none;
}
```

Import the CSS in your titlebar component:

```tsx
import './titlebar.css';
```

## Step 9: Integrate Titlebar into App

Edit `src/App.tsx`:

```tsx
import { Titlebar } from './features/Titlebar';

function App() {
  return (
    <>
      <Titlebar />
      <main style={{ paddingTop: '40px' }}>
        {/* Your app content */}
      </main>
    </>
  );
}
```

**Important:** Add padding-top to your main content to account for the titlebar height.

## Step 10: Build and Test

```bash
pnpm tauri dev
```

**Test the following:**
1. ✅ Window dragging - Click and drag the titlebar to move the window
2. ✅ Close button - Should close the application
3. ✅ Minimize button - Should minimize the window
4. ✅ Maximize button - Should toggle fullscreen/windowed mode
5. ✅ Button hover effects - Icons should appear on hover

## Advanced: Window State Management

To track window state (maximized, focused, etc.), use event listeners:

```tsx
import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';

export function Titlebar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const appWindow = getCurrentWindow();

  useEffect(() => {
    // Listen to window focus changes
    const unlistenFocus = appWindow.onFocusChanged(({ payload: focused }) => {
      setIsFocused(focused);
    });

    // Listen to window resize (to detect maximize/restore)
    const unlistenResize = appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    // Cleanup listeners
    return () => {
      unlistenFocus.then(fn => fn());
      unlistenResize.then(fn => fn());
    };
  }, [appWindow]);

  return (
    <TitlebarContainer>
      {/* Use isMaximized and isFocused for conditional styling */}
    </TitlebarContainer>
  );
}
```

## Critical Rules

### ✅ DO:
- Add `data-tauri-drag-region` to the titlebar container
- Use `getCurrentWindow()` for window controls
- Clean up event listeners in `useEffect` return function
- Add `macos-private-api` feature for macOS support

### ❌ DON'T:
- Add `data-tauri-drag-region` to interactive elements (buttons, inputs)
- Forget to add padding-top to main content
- Leave event listeners without cleanup
- Use inline event handlers without proper cleanup

## Troubleshooting

**Drag region not working:**
- Ensure `data-tauri-drag-region` is on the container element
- Check that `decorations: false` is set in `tauri.conf.json`

**Buttons not clickable:**
- Remove `data-tauri-drag-region` from button elements
- Ensure buttons are children of the drag region, not direct elements

**macOS issues:**
- Verify `macos-private-api` feature is in `Cargo.toml`
- Rebuild the application after adding the feature

**Event listener memory leaks:**
- Always return cleanup function in `useEffect`
- Use the unlisten function returned by event listeners
