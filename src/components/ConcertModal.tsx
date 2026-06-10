"use client";

import React from "react";
import { Concert, Ticket } from "../types";

interface Props {
  concert: Concert;
  tickets: Ticket[];
  isLoading: boolean;
  onClose: () => void;
}

export default function ConcertModal({ concert, tickets, isLoading, onClose }: Props) {
  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 transition-all duration-300"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 relative flex flex-col md:flex-row transform transition-transform duration-300 scale-100 min-h-[500px]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 p-2 rounded-full backdrop-blur-md transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className={`w-full md:w-1/2 h-80 md:h-auto bg-gradient-to-br ${concert.gradient} relative flex shrink-0 p-6 md:p-10 items-center justify-center`}>
          {concert.poster ? (
            <img src={concert.poster} alt={concert.title} className="w-full h-full object-contain drop-shadow-2xl rounded-lg" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
              <h3 className="text-2xl font-black text-white drop-shadow-md">{concert.title}</h3>
            </div>
          )}
        </div>

        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-white dark:bg-slate-900">
          <div className="space-y-3 mb-6 pr-8">
            <span className="inline-block bg-indigo-50 dark:bg-[#00F5D4]/10 text-indigo-600 dark:text-[#00F5D4] text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider border border-indigo-100 dark:border-[#00F5D4]/30">
              {concert.tag}
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">{concert.title}</h3>
          </div>

          <div className="space-y-3 text-sm md:text-base font-semibold text-slate-700 dark:text-slate-300 mb-6">
            <p className="flex items-center gap-3"><span className="text-lg">📍</span> <span>{concert.venue}</span></p>
            <p className="flex items-center gap-3"><span className="text-lg">📅</span> <span className="text-indigo-600 dark:text-[#00F5D4]">{concert.date}</span></p>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed space-y-2 flex-1">
            <p className="font-bold text-slate-700 dark:text-slate-300 mb-2">💡 공연 안내 및 유의사항</p>
            <p>• 본 공연은 KOPIS 오픈 API를 통해 제공되는 실시간 정보입니다.</p>
            <p>• 티켓 예매 일정 및 라인업 타임테이블 정보는 공연장 사정에 따라 변동될 수 있으므로, 예매 전 공식 예매처를 반드시 확인해 주시기 바랍니다.</p>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {isLoading ? (
              <button disabled className="w-full text-center py-4 rounded-xl font-black text-sm md:text-base shadow-xl bg-slate-300 text-slate-500 cursor-not-allowed pointer-events-none transition-all tracking-tight block">
                ⏳ 예매처 정보 불러오는 중...
              </button>
            ) : tickets.length > 0 ? (
              tickets.map((ticket, idx) => (
                <a key={idx} href={ticket.url} target="_blank" rel="noopener noreferrer" className="w-full text-center py-3.5 rounded-xl font-black text-sm md:text-base shadow-lg bg-slate-900 dark:bg-[#00F5D4] text-white dark:text-slate-950 hover:opacity-90 active:scale-95 transition-all tracking-tight block">
                  🎟️ {ticket.name} 예매하기
                </a>
              ))
            ) : (
              <button disabled className="w-full text-center py-4 rounded-xl font-black text-sm md:text-base shadow-xl bg-slate-300 text-slate-500 cursor-not-allowed pointer-events-none transition-all tracking-tight block">
                🚫 등록된 예매처가 없습니다
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}