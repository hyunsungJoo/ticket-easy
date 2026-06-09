"use client";

import React, { useEffect, useState } from "react";

interface Concert {
  id: number;
  title: string;
  venue: string;
  date: string;
  tag: string;
  gradient: string;
}

export default function Home() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 무한 루프 상태 관리
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [translateX, setTranslateX] = useState(-312); // 카드 너비(288) + 간격(24) = 312px 이동
  const [isHovered, setIsHovered] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // 1. API 호출 및 초기 데이터 세팅 (오직 API만 믿고 감!)
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch('/api/concerts');
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
          const arr = [...result.data];
          // 순환을 위해 초기 로드 시 맨 마지막 카드를 맨 앞으로 이동
          if (arr.length > 1) {
            arr.unshift(arr.pop()!);
          }
          setConcerts(arr);
        }
      } catch (error) {
        console.error("API 호출 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcerts();
  }, []);

  // 2. 카드 순환 및 슬라이드 애니메이션 제어 함수
  const move = (direction: "left" | "right") => {
    if (isTransitioning || concerts.length <= 1) return;

    setIsTransitioning(true);
    setLastInteraction(Date.now());

    if (direction === "right") {
      setTranslateX(-624);
    } else {
      setTranslateX(0);
    }

    setTimeout(() => {
      setIsTransitioning(false);
      setTranslateX(-312);

      setConcerts((prev) => {
        const arr = [...prev];
        if (direction === "right") {
          arr.push(arr.shift()!);
        } else {
          arr.unshift(arr.pop()!);
        }
        return arr;
      });
    }, 500); 
  };

  // 3. 자동 롤링 타이머
  useEffect(() => {
    if (isHovered || concerts.length <= 1) return;

    const timer = setTimeout(() => {
      move("right");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isHovered, concerts, lastInteraction]);

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-12 transition-colors duration-300 overflow-hidden">
      
      {/* 1. 추천 공연 인터랙티브 슬라이더 */}
      <section 
        className="relative w-full py-4 -mx-6 px-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>🔥</span> 이번 주 추천 공연
          </h2>
          
          <div className="flex gap-2">
            <button 
              onClick={() => move("left")}
              className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4] transition-all shadow-sm z-20 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button 
              onClick={() => move("right")}
              className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4] transition-all shadow-sm z-20 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="absolute left-0 top-16 bottom-0 w-12 bg-gradient-to-r from-slate-50 dark:from-[#0F172A] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-16 bottom-0 w-12 bg-gradient-to-l from-slate-50 dark:from-[#0F172A] to-transparent z-10 pointer-events-none"></div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48 text-slate-500 font-bold">공연 정보를 불러오는 중입니다...</div>
        ) : (
          <div className="overflow-hidden w-full pb-4 pt-2 relative">
            <div 
              className={`flex gap-6 w-max ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
              style={{ transform: `translateX(${translateX}px)` }}
            >
              {concerts.map((concert, idx) => (
                <div 
                  key={`concert-${concert.id}-${idx}`} 
                  className="w-72 shrink-0 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-indigo-400 dark:hover:border-[#00F5D4]/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className={`h-40 bg-gradient-to-br ${concert.gradient} relative flex items-center justify-center p-4`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                    <h3 className="text-lg font-black text-white text-center drop-shadow-md z-10 leading-tight group-hover:scale-105 transition-transform duration-300">
                      {concert.title}
                    </h3>
                    <span className="absolute top-3 right-3 text-[10px] bg-black/60 text-white font-bold px-2 py-1 rounded backdrop-blur-sm">
                      {concert.tag}
                    </span>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500 dark:text-slate-400">📍 {concert.venue}</span>
                      <span className="text-indigo-600 dark:text-[#00F5D4]">📅 {concert.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2. 날짜 필터 칩 */}
      <section className="space-y-4">
        <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white transition-colors duration-300">
          <span>📅</span> 언제 공연을 즐기고 싶으신가요?
        </h2>
        <div className="flex flex-wrap gap-3">
          <button className="bg-[#00F5D4] text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#00F5D4]/20 hover:scale-105 transition-transform">
            🔥 오늘 열리는 공연
          </button>
          <button className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors duration-300">
            🎸 이번 주말 (토/일)
          </button>
          <button className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors duration-300">
            🍻 금요일 밤 분위기
          </button>
        </div>
      </section>

      {/* 3. 메인 콘텐츠 2단 스플릿 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 리스트 피드 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-3 transition-colors duration-300">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300">지금 주목해야 할 공연 리스트</h2>
            <div className="flex gap-2">
              <span className="bg-indigo-50 dark:bg-slate-800 text-xs px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-slate-700/60 font-bold cursor-pointer text-indigo-600 dark:text-[#00F5D4] transition-colors duration-300">홍대/합정</span>
              <span className="bg-white dark:bg-slate-800 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/60 font-semibold cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-300">성수/서울숲</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* 공연 아이템 1 */}
            <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex gap-4 hover:border-indigo-300 dark:hover:bg-slate-800/60 transition-all group cursor-pointer shadow-sm dark:shadow-none">
              <div className="w-24 h-32 md:w-28 md:h-36 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl shrink-0 overflow-hidden relative shadow-md">
                <span className="absolute bottom-2 left-2 text-[10px] bg-slate-950/80 text-[#00F5D4] font-bold px-1.5 py-0.5 rounded">CLUB FF</span>
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex gap-2 items-center mb-1.5">
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 px-2 py-0.5 rounded font-bold uppercase tracking-wider transition-colors duration-300">INDIE ROCK</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold transition-colors duration-300">서울 마포구 | 클럽 FF</span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#00F5D4] transition-colors duration-300 leading-snug">
                    Midsummer Night{"'"}s Dream (한여름 밤의 꿈)
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 transition-colors duration-300">아도이</span>
                    <span className="text-[11px] bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 transition-colors duration-300">설(SURL)</span>
                    <span className="text-[11px] bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 transition-colors duration-300">라쿠나</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 border-t border-slate-100 dark:border-slate-800/40 pt-2 text-xs transition-colors duration-300">
                  <span className="text-slate-500 dark:text-slate-400 font-bold transition-colors duration-300">2026.06.14 (일) 19:00</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 px-2.5 py-1 rounded-lg transition-colors duration-300">현장예매 가능</span>
                </div>
              </div>
            </div>

            {/* 공연 아이템 2 */}
            <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex gap-4 hover:border-pink-300 dark:hover:bg-slate-800/60 transition-all group cursor-pointer shadow-sm dark:shadow-none">
              <div className="w-24 h-32 md:w-28 md:h-36 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shrink-0 overflow-hidden relative shadow-md">
                <span className="absolute bottom-2 left-2 text-[10px] bg-slate-950/80 text-[#00F5D4] font-bold px-1.5 py-0.5 rounded">벨로주</span>
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <div className="flex gap-2 items-center mb-1.5">
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 px-2 py-0.5 rounded font-bold uppercase tracking-wider transition-colors duration-300">FOLK / JAZZ</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold transition-colors duration-300">서울 마포구 | 벨로주 홍대</span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-[#00F5D4] transition-colors duration-300 leading-snug">
                    어쿠스틱 보야지 : 소규모 위크엔드 라이브
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 transition-colors duration-300">김뜻돌</span>
                    <span className="text-[11px] bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 transition-colors duration-300">브로콜리너마저</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 border-t border-slate-100 dark:border-slate-800/40 pt-2 text-xs transition-colors duration-300">
                  <span className="text-slate-500 dark:text-slate-400 font-bold transition-colors duration-300">2026.06.20 (토) 18:00</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/50 px-2.5 py-1 rounded-lg transition-colors duration-300">온라인 예매</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 사이드바 (아티스트 트렌드) */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800/80 pb-3 transition-colors duration-300">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2 transition-colors duration-300">
              <span>✨</span> 지금 핫한 인디 아티스트
            </h2>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4 space-y-4 shadow-sm dark:shadow-none transition-colors duration-300">
            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00F5D4] to-indigo-600 font-black text-xs flex items-center justify-center text-slate-950 shadow-sm">
                  SG
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#00F5D4] transition-colors duration-300">실리카겔 (Silica Gel)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">이번 달 등록 공연 <span className="text-indigo-600 dark:text-[#00F5D4] font-semibold">3건</span></p>
                </div>
              </div>
              <button className="text-[11px] font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-[#00F5D4] hover:border-indigo-600 dark:hover:border-[#00F5D4] px-3 py-1.5 rounded-lg transition-colors">
                팔로우
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF007F] to-amber-500 font-black text-xs flex items-center justify-center text-white shadow-sm">
                  HR
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-[#00F5D4] transition-colors duration-300">한로로 (HANRORO)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">이번 달 등록 공연 <span className="text-pink-600 dark:text-[#00F5D4] font-semibold">1건</span></p>
                </div>
              </div>
              <button className="text-[11px] font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-[#00F5D4] hover:border-pink-600 dark:hover:border-[#00F5D4] px-3 py-1.5 rounded-lg transition-colors">
                팔로우
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800/40 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 font-black text-xs flex items-center justify-center text-white shadow-sm">
                  AD
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-[#00F5D4] transition-colors duration-300">아도이 (ADOY)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">이번 달 등록 공연 <span className="text-purple-600 dark:text-[#00F5D4] font-semibold">2건</span></p>
                </div>
              </div>
              <button className="text-[11px] font-bold bg-indigo-50 dark:bg-[#00F5D4]/10 text-indigo-600 dark:text-[#00F5D4] border border-indigo-200 dark:border-[#00F5D4]/30 px-3 py-1.5 rounded-lg transition-colors">
                팔로잉
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}