import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeProvider";
import { ThemeToggle } from "../components/ThemeToggle";

export const metadata: Metadata = {
  title: "INDIE WAVE - 공연 정보 플랫폼 컨셉",
  description: "홍대 인디 아티스트 및 소규모 콘서트 아카이브 프로젝트",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 1) suppressHydrationWarning이 들어있어야 에러가 안 납니다.
    <html lang="ko" suppressHydrationWarning>
      {/* 2) body 태그에 라이트모드 배경(bg-slate-50)과 다크모드 배경(dark:bg-[#0F172A])이 둘 다 지정되어야 합니다. */}
      <body className="bg-slate-50 text-slate-900 dark:bg-[#0F172A] dark:text-slate-100 min-h-screen font-sans antialiased transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-6 py-4 flex justify-between items-center transition-colors duration-300">
            <div className="flex items-center gap-8">
              <a href="#" className="text-2xl font-black tracking-wider text-[#00F5D4]">INDIE_WAVE</a>
              <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <a href="#" className="text-[#00F5D4] transition">공연 일정</a>
                <a href="#" className="hover:text-[#00F5D4] transition">아티스트</a>
                <a href="#" className="hover:text-[#00F5D4] transition">공연장 공간</a>
                <a href="#" className="hover:text-[#00F5D4] transition">매거진</a>
                <a href="#" className="hover:text-[#00F5D4] transition">테스트</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {/* 3) 토글 버튼 컴포넌트가 정상적으로 들어가 있는지 확인 */}
              <ThemeToggle />
              
              <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">공연 등록/제휴</button>
              <button className="bg-[#00F5D4] text-slate-950 px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-[#00F5D4]/10 hover:bg-[#00e0c2] transition">
                로그인
              </button>
            </div>
          </header>

          {children}

          <footer className="mt-24 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-950 text-slate-500 text-xs px-6 py-8 text-center space-y-2 transition-colors duration-300">
            <p className="font-bold text-slate-500 dark:text-slate-400">INDIE_WAVE — 홍대 인디 아티스트 및 소규모 콘서트 아카이브 프로젝트</p>
            <p>© 2026 INDIE_WAVE. Built for Music Lovers.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}