---
trigger: always_on
---

# Tauri Desktop App Template Rules

## Project Structure
- Frontend: React + TypeScript + Vite (`src/`)
- Backend: Rust + Tauri (`src-tauri/`)
- Workflows: `.agent/workflows/` - step-by-step guides
- Docs: `docs/` - user documentation

## Available Workflows

**Always check workflows first before implementing features!**

- **Custom Titlebar**: `.agent/workflows/tauri-titlebar.md`
  - Needs `decorations: false` in `tauri.conf.json`
  - Needs `macos-private-api` in `Cargo.toml` for macOS
  - Use `data-tauri-drag-region` for draggable areas
  - Never add `data-tauri-drag-region` to buttons/inputs

- **macOS "Open With"**: `.agent/workflows/tauri-open-with.md`
  - Must add `fileAssociations` in `tauri.conf.json` (critical!)
  - Use `tauri-plugin-store` for file path persistence
  - Implement `RunEvent::Opened` handler
  - Clear store after navigation to prevent redirect loops

## Code Organization
- Frontend utils → `src/utils/`
- Frontend components → `src/components/` (shared) or `src/features/` (feature-specific)
- Backend commands → `src-tauri/src/commands/`
- Backend utils → `src-tauri/src/utils/`

## Always Remember
- Add permissions to `src-tauri/capabilities/default.json`
- Create modular, reusable code
- Clean up event listeners in useEffect return
- Use TypeScript interfaces for type safety

## Build Commands
- `pnpm app-dev` - dev mode
- `pnpm app-build` - production build
- `pnpm rename "Name"` - rename app
