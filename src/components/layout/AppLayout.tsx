"use client";

import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";
import clsx from "clsx";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const theme = useStore((state) => state.theme);

  // Don't show navigation on login page
  const isLoginPage = pathname === "/login" || pathname === "/";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div
      className={clsx(
        "min-h-screen transition-colors",
        theme === "dark" ? "bg-dark-bg" : "bg-light-bg"
      )}
    >
      {/* Desktop Sidebar - hidden on mobile */}
      <div
        className={clsx(
          "hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:overflow-y-auto lg:border-r",
          theme === "dark"
            ? "lg:border-dark-border lg:bg-dark-bg"
            : "lg:border-light-border lg:bg-light-bg"
        )}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="min-h-screen pb-20 lg:pb-0">{children}</div>
      </main>

      {/* Mobile Bottom Nav - hidden on desktop */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
