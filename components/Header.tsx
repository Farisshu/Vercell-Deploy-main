"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui";
import Sidebar from "@/components/Sidebar";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("embedded-study-theme");
    const useLight = savedTheme === "light";
    document.documentElement.classList.toggle("light", useLight);
    setIsLightMode(useLight);
  }, []);

  const toggleTheme = () => {
    const nextLightMode = !isLightMode;
    setIsLightMode(nextLightMode);
    document.documentElement.classList.toggle("light", nextLightMode);
    window.localStorage.setItem("embedded-study-theme", nextLightMode ? "light" : "dark");
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-xl lg:ml-72">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-can">Embedded Study Hub</p>
              {title && <h1 className="truncate text-lg font-semibold lg:text-xl">{title}</h1>}
            </div>
          </div>

          <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full bg-card/80">
            {isLightMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </header>
    </>
  );
}
