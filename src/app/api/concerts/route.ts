import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.KOPIS_API_KEY;
    
    // API 키가 아예 없을 때 (테스트 환경)
    if (!apiKey) {
      console.log("API Key가 없어 더미 데이터를 반환합니다.");
      return NextResponse.json({ 
        success: true, 
        data: getFallbackData(), 
        tickets: [{ name: "인터파크 티켓", url: "https://ticket.interpark.com" }] 
      });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // ==========================================
    // 1️⃣ 상세 예매 링크 다중 조회 (?id= 가 있을 때)
    // ==========================================
    if (id) {
      const detailUrl = `http://www.kopis.or.kr/openApi/restful/pblprfr/${id}?service=${apiKey}`;
      const res = await fetch(detailUrl);
      const xmlText = await res.text();
      
      const result = await parseStringPromise(xmlText);
      const db = result.dbs?.db?.[0];

      // 💡 예매처 정보를 담을 배열 생성
      let tickets: { name: string; url: string }[] = [];
      
      const relatesArray = db?.relates?.[0]?.relate;
      
      if (relatesArray && relatesArray.length > 0) {
        // 여러 예매처를 순회하며 배열에 담기
        tickets = relatesArray.map((rel: any) => ({
          name: rel.relatenm?.[0] || "예매처",
          url: rel.relateurl?.[0] || ""
        })).filter((t: any) => t.url !== ""); // URL이 비어있는 쓰레기 데이터 걸러내기
      }

      // KOPIS에 예매처 정보가 아예 비어있으면 기본값 세팅
      if (tickets.length === 0) {
        tickets.push({ name: "인터파크 티켓", url: "https://ticket.interpark.com" });
      }

      return NextResponse.json({ success: true, tickets });
    }

    // ==========================================
    // 2️⃣ 전체 공연 목록 조회 (id가 없을 때)
    // ==========================================
    const today = new Date();
    const stdate = today.toISOString().slice(0, 10).replace(/-/g, '');
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    const eddate = nextMonth.toISOString().slice(0, 10).replace(/-/g, '');

    const listUrl = `http://kopis.or.kr/openApi/restful/pblprfr?service=${apiKey}&stdate=${stdate}&eddate=${eddate}&cpage=1&rows=10&signgucode=11`;
    
    const res = await fetch(listUrl);
    const xmlText = await res.text();

    const result = await parseStringPromise(xmlText);

    if (!result.dbs || !result.dbs.db) {
      throw new Error("KOPIS 데이터가 없습니다.");
    }

    const concertData = result.dbs.db.map((item: any) => ({
      id: item.mt20id[0], 
      title: item.prfnm[0], 
      venue: item.fcltynm[0], 
      date: `${item.prfpdfrom[0]} ~ ${item.prfpdto[0]}`, 
      tag: item.genrenm[0], 
      poster: item.poster[0], 
      gradient: "from-slate-800 to-slate-900" 
    }));

    return NextResponse.json({ success: true, data: concertData });
    
  } catch (error) {
    console.error("KOPIS 연동 에러:", error);
    return NextResponse.json({ 
      success: true, 
      data: getFallbackData(), 
      tickets: [{ name: "인터파크 티켓", url: "https://ticket.interpark.com" }] 
    });
  }
}

function getFallbackData() {
  return [
    { id: "PF001", title: "2026 홍대 인디 록 페스티벌", venue: "클럽 FF", date: "2026.07.03", tag: "ROCK", poster: "", gradient: "from-[#FF007F] to-purple-600" },
    { id: "PF002", title: "어쿠스틱 보야지 : 새벽의 노래", venue: "벨로주 홍대", date: "2026.06.20", tag: "ACOUSTIC", poster: "", gradient: "from-cyan-400 to-blue-600" },
    { id: "PF003", title: "Neon Jungle : 신스웨이브", venue: "롤링홀", date: "2026.06.25", tag: "SYNTH POP", poster: "", gradient: "from-[#00F5D4] to-indigo-600" },
  ];
}