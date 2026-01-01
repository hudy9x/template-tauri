---
trigger: manual
---

# Tauri Custom Titlebar Implementation Guide

## Overview

This guide provides the essential steps to implement a custom titlebar in Tauri applications. A custom titlebar is required when using `decorations: false` in Tauri configuration.

## Prerequisites

### Required Dependencies

**Frontend** (`package.json`):
```json
{
  "@tauri-apps/api": "^2.x.x",
  "react": "^18.x.x"
}
```

**Backend** (`src-tauri/Cargo.toml`):
```toml
[dependencies]
tauri = { version = "2", features = ["macos-private-api"] }
```

**Important**: The `macos-private-api` feature is required for proper titlebar functionality on macOS.

### Tauri Configuration

In `src-tauri/tauri.conf.json`:

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

**Critical Settings:**
- `decorations: false` - Removes native window decorations (required)
- `transparent: true` - Enables transparency for custom styling
- `shadow: true` - Maintains native window shadow

## Basic Implementation

### Step 1: Create Titlebar Container

**File**: `src/features/Titlebar/TitlebarContainer.tsx`

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

**Critical Attribute:**
- `data-tauri-drag-region` - Enables window dragging by clicking this element

### Step 2: Create Window Control Buttons

**File**: `src/features/Titlebar/WindowButtons.tsx`

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

**Important**: Button elements should NOT have `data-tauri-drag-region` attribute, otherwise they won't be clickable.

### Step 3: Create Main Titlebar Component

**File**: `src/features/Titlebar/index.tsx`

```tsx
import { TitlebarContainer } from './TitlebarContainer';
import { WindowButtons } from './WindowButtons';

export function Titlebar() {
  return (
    <TitlebarContainer>
      <div>
        <span>App Title</span>
      </div>
      <WindowButtons />
    </TitlebarContainer>
  );
}
```

### Step 4: Integrate into Application

**File**: `src/App.tsx`

```tsx
import { Titlebar } from './features/Titlebar';

function App() {
  return (
    <div>
      <Titlebar />
      <main>
        {/* Your app content */}
      </main>
    </div>
  );
}
```

## Key Concepts

### Drag Region

- **Purpose**: Allows users to drag the window by clicking on the titlebar
- **Implementation**: Add `data-tauri-drag-region` attribute to draggable elements
- **Critical Rule**: Do NOT add this attribute to interactive elements (buttons, inputs, etc.)

```tsx
// ✅ Correct - buttons are clickable
<div data-tauri-drag-region>
  <button>Click me</button>
</div>

// ❌ Incorrect - button will drag instead of click
<button data-tauri-drag-region>Click me</button>
```

### Window Control Methods

```typescript
import { getCurrentWindow } from '@tauri-apps/api/window';

const appWindow = getCurrentWindow();

// Basic window controls
appWindow.minimize();        // Minimize window
appWindow.maximize();        // Maximize window
appWindow.unmaximize();      // Restore window
appWindow.toggleMaximize();  // Toggle between maximize/restore
appWindow.close();           // Close window
```

### Window State Queries

```typescript
// Check window state
const isMaximized = await appWindow.isMaximized();
const isFullscreen = await appWindow.isFullscreen();
const isFocused = await appWindow.isFocused();
```

### Event Listeners

```typescript
import { useEffect } from 'react';

// Listen to window focus changes
useEffect(() => {
  const unlisten = appWindow.onFocusChanged(({ payload: focused }) => {
    console.log('Window focused:', focused);
  });

  // Cleanup listener
  return () => {
    unlisten.then(fn => fn());
  };
}, [appWindow]);

// Listen to window resize
useEffect(() => {
  const unlisten = appWindow.onResized(({ payload }) => {
    console.log('Window resized:', payload);
  });

  return () => {
    unlisten.then(fn => fn());
  };
}, [appWindow]);
```

## Common Issues

### 1. Drag Region Not Working

**Problem**: Window doesn't drag when clicking titlebar.

**Solution**: Ensure `data-tauri-drag-region` attribute is on the container element.

### 2. Buttons Not Clickable

**Problem**: Clicking buttons drags the window instead.

**Solution**: Remove `data-tauri-drag-region` from button elements and their direct parent containers.

### 3. Event Listener Memory Leaks

**Problem**: Event listeners not cleaned up properly.

**Solution**: Always return cleanup function in `useEffect`:

```tsx
useEffect(() => {
  const unlisten = appWindow.onFocusChanged(handler);
  
  return () => {
    unlisten.then(fn => fn()); // Cleanup
  };
}, [appWindow]);
```

### 4. macOS Titlebar Issues

**Problem**: Titlebar not working properly on macOS.

**Solution**: Ensure `macos-private-api` feature is enabled in `Cargo.toml`:

```toml
[dependencies]
tauri = { version = "2", features = ["macos-private-api"] }
```

## Summary

To create a custom titlebar in Tauri:

1. **Configure Rust**: Add `macos-private-api` feature to `Cargo.toml`
2. **Configure Tauri**: Set `decorations: false` in `tauri.conf.json`
3. **Create Container**: Add `data-tauri-drag-region` to enable dragging
4. **Add Buttons**: Create minimize, maximize, and close buttons using Tauri window API
5. **Integrate**: Add titlebar component to your app layout
6. **Critical Rule**: Never add `data-tauri-drag-region` to interactive elements

The titlebar container must have `data-tauri-drag-region` for window dragging, while buttons use the Tauri window API (`getCurrentWindow()`) for window controls.
