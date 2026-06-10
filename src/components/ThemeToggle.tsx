"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 렌더링 이후에만 UI를 보여주기 위함 (Hydration 에러 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-8 h-8"></div>;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
      aria-label="Toggle Dark Mode"
    >
      {/* 테마에 따라 해/달 아이콘 전환 */}
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}