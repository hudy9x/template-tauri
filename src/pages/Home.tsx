import { Outlet } from "react-router-dom";


export default function Home() {
  return (
    <main className="min-h-screen bg-secondary">
      <div className="home-wrapper flex-1 flex overflow-hidden" style={{ height: "calc(100vh)" }}>
        <div className="flex-1 bg-secondary">
          <Outlet />
        </div>
      </div>

    </main>
  );
}
