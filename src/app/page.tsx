"use client";

import React, { useEffect, useState } from "react";
import { Concert, Ticket } from "../types";
import ConcertSlider from "../components/ConcertSlider";
import ConcertModal from "../components/ConcertModal";

export default function Home() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 팝업 & 티켓 상태 관리
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isTicketLoading, setIsTicketLoading] = useState(false);

  // 메인 API 호출
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await fetch('/api/concerts');
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          setConcerts(result.data);
        }
      } catch (error) {
        console.error("API 호출 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConcerts();
  }, []);

  // 카드 클릭 시 팝업 열고 티켓 정보 가져오기
  const handleCardClick = async (concert: Concert) => {
    setSelectedConcert(concert);
    setTickets([]); 
    setIsTicketLoading(true);

    try {
      const response = await fetch(`/api/concerts?id=${concert.id}`);
      const result = await response.json();
      if (result.success && result.tickets) {
        setTickets(result.tickets);
      }
    } catch (error) {
      console.error("예매 링크 조회 실패:", error);
    } finally {
      setIsTicketLoading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto p-6 space-y-12 transition-colors duration-300 overflow-hidden">
      
      {/* 💡 1. 분리된 슬라이더 컴포넌트 삽입 */}
      <ConcertSlider 
        initialConcerts={concerts} 
        isLoading={isLoading} 
        onCardClick={handleCardClick} 
      />

      {/* 2. 날짜 필터 칩 */}
      <section className="space-y-4">
        <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-slate-900 dark:text-white transition-colors duration-300">
          <span>📅</span> 언제 공연을 즐기고 싶으신가요?
        </h2>
        <div className="flex flex-wrap gap-3">
          <button className="bg-[#00F5D4] text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#00F5D4]/20 hover:scale-105 transition-transform">🔥 오늘 열리는 공연</button>
          <button className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors duration-300">🎸 이번 주말 (토/일)</button>
          <button className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors duration-300">🍻 금요일 밤 분위기</button>
        </div>
      </section>

      {/* 3. 하단 리스트 & 우측 사이드바 레이아웃 (추후 이곳도 컴포넌트 분리 가능!) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800/80 pb-3 transition-colors duration-300">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300">지금 주목해야 할 공연 리스트</h2>
          </div>
          <div className="space-y-4">
            {/* 정적인 더미 리스트 생략 없이 그대로 유지됨 (코드 축약을 위해 UI 형태만 유지) */}
            <div className="bg-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex gap-4 hover:border-indigo-300 dark:hover:bg-slate-800/60 transition-all cursor-pointer">
              <div className="w-24 h-32 md:w-28 md:h-36 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white">클럽 FF</div>
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white">Midsummer Night's Dream</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">📍 홍대 | 📅 2026.06.14</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800/80 pb-3 transition-colors duration-300">
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300">✨ 지금 핫한 인디 아티스트</h2>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800/60 rounded-2xl p-4 space-y-4">
             <p className="text-sm font-bold text-slate-700 dark:text-slate-300">아티스트 트렌드 목록...</p>
          </div>
        </div>
      </div>

      {/* 💡 4. 분리된 팝업 모달 컴포넌트 삽입 */}
      {selectedConcert && (
        <ConcertModal 
          concert={selectedConcert}
          tickets={tickets}
          isLoading={isTicketLoading}
          onClose={() => setSelectedConcert(null)}
        />
      )}

    </main>
  );
}