import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";


export default function Home() {
  return (
    <main className="min-h-screen bg-secondary">
      <div className="home-wrapper flex-1 flex overflow-hidden" style={{ height: "calc(100vh)" }}>
        <div className="flex-1 bg-secondary relative">
          <Outlet />

          {/* Theme Toggle Button - Centered */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
