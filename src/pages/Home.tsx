import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Titlebar } from "@/features/Titlebar";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main
      className={cn(
        "fixed top-0 left-0 z-50 w-full h-full flex flex-col items-center justify-center bg-background",
        "transition-opacity duration-600 delay-[200ms] ease-in-out fill-mode-forwards",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >

      <Titlebar />


      <h1 className="text-4xl font-bold tracking-tight">Welcome to Tauri</h1>
      <p className="text-muted-foreground mt-4 text-lg">Build smaller, faster, and more secure desktop applications.</p>
    </main>
  );
}
