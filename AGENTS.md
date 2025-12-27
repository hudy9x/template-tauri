AGENTS.md — Repo agent guidance

## Project Overview
This is a template for building cross-platform desktop applications using Tauri, React, and TypeScript. The template comes pre-configured with essential tools, UI components, and backend commands for file system and Git operations.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui (pre-configured)
- **Styling**: Tailwind CSS v4
- **State Management**: Jotai
- **Routing**: React Router v7
- **Backend**: Tauri v2 + Rust
- **Build Tool**: Vite

## Code Structure
```
src/                    # Frontend React application
├── components/         # Reusable UI components (shadcn/ui)
├── features/           # Feature-specific components
├── pages/              # Page components for routing
├── stores/             # Jotai state management stores
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── App.tsx             # Main application component
└── main.tsx            # Application entry point

src-tauri/              # Tauri backend (Rust)
├── src/
│   ├── commands/       # Tauri command modules
│   │   ├── files.rs    # File system operations
│   │   └── git.rs      # Git operations
│   ├── lib.rs          # Main library file
│   └── main.rs         # Application entry point
├── Cargo.toml          # Rust dependencies
└── tauri.conf.json     # Tauri configuration
```

## Built-in Tauri Commands

### File System Commands (files.rs)
- `list_dir(path: string)` - List directory contents
- `read_file_content(path: string)` - Read file content
- `write_file_content(path: string, content: string)` - Write to file
- `create_directory(path: string)` - Create directory
- `create_file(path: string)` - Create file
- `delete_node(path: string)` - Delete file/directory
- `rename_node(old_path: string, new_path: string)` - Rename/move file/directory

### Git Commands (git.rs)
- `get_current_branch(working_dir: string)` - Get current branch
- `get_all_branches(working_dir: string)` - List all branches
- `switch_branch(working_dir: string, branch: string)` - Switch branch
- `get_git_status(working_dir: string)` - Get file status (modified, added, etc.)
- `git_pull(working_dir: string)` - Pull from remote

## Build / dev / app commands
- Run dev UI: `pnpm dev` (runs `vite`).
- Build web: `pnpm build` (runs `tsc && vite build`).
- Preview build: `pnpm preview`.
- Tauri app dev: `pnpm app-dev`.
- Tauri app build: `pnpm app-build`.

## Tests & lint
- This repo has no test runner or linter configured by default.
- Recommended single-test workflow (Vitest): `pnpm add -D vitest @testing-library/react` then `pnpm vitest -t "Your test name"` to run a single test by name.
- Recommended lint command (ESLint): `pnpm add -D eslint` then `pnpm eslint "src/**/*.{ts,tsx}" --fix`.

## Code style (agents must follow)
- Imports: group and order imports as: external packages → UI/lib → features/stores → relative imports; keep them sorted within groups.
- Formatting: use Prettier (or `prettier --write`) and TypeScript formatting rules; keep 2-space indent.
- Types: prefer explicit return types for exported functions/components; avoid `any` — use `unknown` and narrow instead.
- React components: `PascalCase` filenames and component names (e.g. `MyComponent.tsx`).
- Other files/variables: `camelCase` for functions/vars, `UPPER_SNAKE` for constants.
- Exports: prefer named exports; avoid default exports for shared modules.
- Error handling: do not swallow errors; log with `console.error` and return meaningful error objects or throw with context.
- Side effects: keep components pure where possible; push side effects to hooks or stores (`stores/`).

## UI Components
This template uses shadcn/ui with Tailwind CSS. Pre-configured components include:
- Context Menu, Dialog, Dropdown Menu
- Popover, Progress, Switch
- Toast, Tooltip
- Command (cmdk)

When adding new shadcn/ui components, use: `pnpm dlx shadcn@latest add [component-name]`

## State Management
- Use Jotai for global state management
- Store files should be placed in `src/stores/`
- Follow atomic state patterns
- Keep stores focused and composable

## Routing
- React Router v7 is configured for client-side routing
- Page components should be placed in `src/pages/`
- Use React Router's data loading patterns where applicable

## Tooling rules
- Cursor / Copilot rules: no `.cursor` or `.cursorrules` and no `.github/copilot-instructions.md` were found in repo — none to enforce.

## Scope
- This file applies to the entire repository. Follow these rules when making edits, running commands, or authoring changes.