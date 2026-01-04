---
description: Create a custom titlebar for Tauri applications on macOS
---

# Tauri Custom Titlebar Implementation

This workflow guides you through creating a custom titlebar with window controls for Tauri applications on macOS.

## Prerequisites

- Tauri v2 application
- React application
- macOS development environment

## Step 1: Configure Tauri for Custom Titlebar

Edit `src-tauri/tauri.conf.json` and set decorations to false:

```json
{
  "app": {
    "windows": [
      {
        "decorations": false,
        "titleBarStyle": "Overlay"
      }
    ]
  }
}
```

This removes the native macOS titlebar so you can create your own.

## Step 2: Add Window Control Permissions

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

## Step 3: Create Titlebar Feature Structure

Create the following folder structure:

```
src/features/Titlebar/
├── index.tsx           # Main Titlebar component
├── MacOSButtons.tsx    # macOS window control buttons
└── titlebar.css        # Titlebar styles
```

## Step 4: Create MacOS Window Control Buttons

Create `src/features/Titlebar/MacOSButtons.tsx`:

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';

export function MacOSButtons() {
  const appWindow = getCurrentWindow();

  const handleClose = () => appWindow.close();
  const handleMinimize = () => appWindow.minimize();
  const handleMaximize = () => appWindow.toggleMaximize();

  return (
    <div className="titlebar-buttons">
      <button
        className="titlebar-button close"
        onClick={handleClose}
        aria-label="Close"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M1 1 L11 11 M11 1 L1 11" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      
      <button
        className="titlebar-button minimize"
        onClick={handleMinimize}
        aria-label="Minimize"
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path d="M2 6 L10 6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      
      <button
        className="titlebar-button maximize"
        onClick={handleMaximize}
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

## Step 5: Create Titlebar Component

Create `src/features/Titlebar/index.tsx`:

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';
import { MacOSButtons } from './MacOSButtons';
import './titlebar.css';

export function Titlebar() {
  const appWindow = getCurrentWindow();

  const handleDragStart = () => {
    appWindow.startDragging();
  };

  return (
    <div className="titlebar" onMouseDown={handleDragStart}>
      <MacOSButtons />
      <div className="titlebar-title">
        {/* Optional: Add app title here */}
      </div>
    </div>
  );
}
```

## Step 6: Create Titlebar Styles

Create `src/features/Titlebar/titlebar.css`:

```css
.titlebar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: transparent;
  display: flex;
  align-items: center;
  padding: 0 12px;
  z-index: 9999;
  user-select: none;
  -webkit-app-region: drag;
}

.titlebar-buttons {
  display: flex;
  gap: 8px;
  -webkit-app-region: no-drag;
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

.titlebar:hover .titlebar-button svg {
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

## Step 7: Add Titlebar to App

In `src/App.tsx`, import and add the Titlebar component:

```typescript
import { Titlebar } from './features/Titlebar';

function App() {
  return (
    <>
      <Titlebar />
      {/* Rest of your app */}
    </>
  );
}
```

## Step 8: Add Body Padding

Add padding to your main content to account for the titlebar height:

```css
body {
  padding-top: 40px;
}
```

Or use a Layout component:

```typescript
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingTop: '40px' }}>
      {children}
    </div>
  );
}
```

## Step 9: Build and Test

```bash
pnpm tauri dev
```

**Test:**
1. Verify titlebar appears at the top
2. Test close button - should close the app
3. Test minimize button - should minimize window
4. Test maximize button - should toggle fullscreen
5. Test dragging - click and drag titlebar to move window

## Customization Options

### Change Button Colors

Modify the button background colors in `titlebar.css`:

```css
.titlebar-button.close {
  background-color: #your-color;
}
```

### Add App Title

In `Titlebar/index.tsx`:

```typescript
<div className="titlebar-title">
  My App Name
</div>
```

### Change Titlebar Height

Update height in both CSS and layout padding:

```css
.titlebar {
  height: 50px; /* Change this */
}
```

### Add Transparency/Blur

```css
.titlebar {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}
```

## Troubleshooting

- **Titlebar not draggable**: Ensure `-webkit-app-region: drag` is set
- **Buttons not working**: Check permissions in `capabilities/default.json`
- **Content hidden behind titlebar**: Add padding-top to body or layout
- **Buttons always visible**: Remove the hover effect from CSS
