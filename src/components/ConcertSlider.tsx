"use client";

import React, { useEffect, useState } from "react";
import { Concert } from "../types";

interface Props {
  initialConcerts: Concert[];
  isLoading: boolean;
  onCardClick: (concert: Concert) => void;
}

export default function ConcertSlider({ initialConcerts, isLoading, onCardClick }: Props) {
  const [sliderConcerts, setSliderConcerts] = useState<Concert[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [translateX, setTranslateX] = useState(-312);
  const [isHovered, setIsHovered] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // 부모(page.tsx)로부터 데이터를 받으면 로컬 슬라이더용으로 세팅
  useEffect(() => {
    if (initialConcerts.length > 0) {
      const arr = [...initialConcerts];
      if (arr.length > 1) {
        arr.unshift(arr.pop()!);
      }
      setSliderConcerts(arr);
    }
  }, [initialConcerts]);

  const move = (direction: "left" | "right") => {
    if (isTransitioning || sliderConcerts.length <= 1) return;

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

      setSliderConcerts((prev) => {
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

  useEffect(() => {
    if (isHovered || sliderConcerts.length <= 1) return;

    const timer = setTimeout(() => {
      move("right");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isHovered, sliderConcerts, lastInteraction]);

  return (
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
          <button onClick={() => move("left")} className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4] transition-all shadow-sm z-20 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          </button>
          <button onClick={() => move("right")} className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#00F5D4] hover:border-[#00F5D4] transition-all shadow-sm z-20 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
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
            {sliderConcerts.map((concert, idx) => (
              <div 
                key={`concert-${concert.id}-${idx}`} 
                onClick={() => onCardClick(concert)} // 💡 클릭 시 부모(page.tsx)의 함수 실행
                className="w-72 shrink-0 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:border-indigo-400 dark:hover:border-[#00F5D4]/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className={`h-40 bg-gradient-to-br ${concert.gradient} relative flex items-center justify-center p-4`}>
                  {concert.poster && (
                    <img src={concert.poster} alt={concert.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <h3 className="text-lg font-black text-white text-center drop-shadow-md z-10 leading-tight group-hover:scale-105 transition-transform duration-300 px-2">{concert.title}</h3>
                  <span className="absolute top-3 right-3 text-[10px] bg-black/80 text-white font-bold px-2 py-1 rounded backdrop-blur-sm z-10">{concert.tag}</span>
                </div>
                
                <div className="p-4">
                  <div className="flex flex-col gap-1.5 text-xs font-bold">
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
  );
}