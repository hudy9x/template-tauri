# Tauri Desktop App Template

A modern template for building cross-platform desktop applications using Tauri, React, and TypeScript. This template comes pre-configured with essential tools and commands to jumpstart your desktop app development.

## 🎯 Overview

This is a production-ready template for building cross-platform desktop applications with:
- 🚀 Native performance with Tauri
- ⚛️ Modern React with TypeScript
- 🎨 Beautiful UI with shadcn/ui components
- 🌐 Cross-platform support (macOS, Windows, Linux)
- 📁 Built-in file system operations
- 🔄 Git integration commands
- 🎯 Global state management with Jotai
- 🛣️ Client-side routing with React Router

## 📁 Code Structure

```
template-tauri/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   ├── features/                 # Feature-specific components
│   ├── pages/                    # Page components for routing
│   ├── stores/                   # Jotai state management stores
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions and helpers
│   ├── App.tsx                   # Main application component
│   └── main.tsx                  # Application entry point
│
├── src-tauri/                    # Tauri backend (Rust)
│   ├── src/
│   │   ├── commands/             # Tauri command modules
│   │   │   ├── files.rs          # File system operations
│   │   │   └── git.rs            # Git operations
│   │   ├── lib.rs                # Main library file
│   │   └── main.rs               # Application entry point
│   ├── Cargo.toml                # Rust dependencies
│   └── tauri.conf.json           # Tauri configuration
│
├── public/                       # Static assets
├── components.json               # shadcn/ui configuration
├── tailwind.config.js            # Tailwind CSS configuration
└── vite.config.ts                # Vite configuration
```

## 🛠️ Built-in Commands

### File System Commands (`src-tauri/src/commands/files.rs`)

The template includes comprehensive file system operations:

- **`list_dir(path: string)`** - List directory contents with file/folder information
- **`read_file_content(path: string)`** - Read file content as string
- **`write_file_content(path: string, content: string)`** - Write content to file
- **`create_directory(path: string)`** - Create a new directory
- **`create_file(path: string)`** - Create a new file
- **`delete_node(path: string)`** - Delete file or directory
- **`rename_node(old_path: string, new_path: string)`** - Rename/move file or directory

### Git Commands (`src-tauri/src/commands/git.rs`)

Built-in Git integration for version control:

- **`get_current_branch(working_dir: string)`** - Get the current Git branch
- **`get_all_branches(working_dir: string)`** - List all Git branches
- **`switch_branch(working_dir: string, branch: string)`** - Switch to a different branch
- **`get_git_status(working_dir: string)`** - Get Git status of files (modified, added, deleted, etc.)
- **`git_pull(working_dir: string)`** - Pull latest changes from remote

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [pnpm](https://pnpm.io/) (Package manager)
- [Rust](https://www.rust-lang.org/) (for Tauri development)
- System dependencies for Tauri (see [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites))

## 🛠️ Development Setup

1. Clone or use this template:
```bash
git clone <your-repo-url>
cd template-tauri
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm app-dev
```

## 📜 Available Scripts

- `pnpm dev` - Start Vite development server (web only)
- `pnpm build` - Build the application (TypeScript compilation + Vite build)
- `pnpm preview` - Preview the built application
- `pnpm app-dev` - Start Tauri development environment
- `pnpm app-build` - Build production Tauri application

## 🏗️ Building for Production

To create a production build:

```bash
pnpm build
pnpm app-build
```

This will generate platform-specific binaries in the `src-tauri/target/release` directory.

## 🔧 Tech Stack

### Frontend
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tool and development server
- [shadcn/ui](https://ui.shadcn.com/) - UI component library (pre-configured)
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Jotai](https://jotai.org/) - Primitive and flexible state management
- [React Router](https://reactrouter.com/) - Client-side routing

### Backend
- [Tauri](https://tauri.app/) - Desktop application framework
- [Rust](https://www.rust-lang.org/) - Systems programming language

### UI Components
This template includes shadcn/ui with the following components pre-configured:
- Context Menu
- Dialog
- Dropdown Menu
- Popover
- Progress
- Switch
- Toast
- Tooltip
- Command (cmdk)

## 🎨 Styling

The template uses **Tailwind CSS** for styling with shadcn/ui components. All components follow the shadcn/ui design system and can be easily customized through the `components.json` configuration file.

## 🗂️ State Management

Global state management is handled by **Jotai**, providing:
- Atomic state management
- Minimal boilerplate
- TypeScript support
- Easy integration with React

Store files are located in `src/stores/`.

## 🛣️ Routing

Client-side routing is powered by **React Router v7**. Define your routes in the appropriate page components located in `src/pages/`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tauri](https://tauri.app/) - For making desktop development with web technologies amazing
- [shadcn/ui](https://ui.shadcn.com/) - For the beautiful component library
- All the amazing open-source projects that make this template possible
