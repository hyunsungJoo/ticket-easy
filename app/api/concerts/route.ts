import { NextResponse } from 'next/server';
import { parseStringPromise } from 'xml2js';

export async function GET() {
  try {
    const apiKey = process.env.KOPIS_API_KEY;
    
    // 💡 수정된 부분: 순수하게 키가 아예 없을 때만 더미 데이터를 주도록 변경!
    if (!apiKey) {
      console.log("API Key가 없어 더미 데이터를 반환합니다.");
      return NextResponse.json({ success: true, data: getFallbackData() });
    }

    // 1. 날짜 자동 계산 (오늘 ~ 한 달 뒤)
    const today = new Date();
    const stdate = today.toISOString().slice(0, 10).replace(/-/g, ''); // 예: 20260609
    const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
    const eddate = nextMonth.toISOString().slice(0, 10).replace(/-/g, '');

    // 2. KOPIS API 호출 URL 세팅 (서울 지역 10개)
    const url = `http://kopis.or.kr/openApi/restful/pblprfr?service=${apiKey}&stdate=${stdate}&eddate=${eddate}&cpage=1&rows=10&signgucode=11`;
    
    const res = await fetch(url);
    const xmlText = await res.text();

    // 3. XML을 JSON 객체로 변환
    const result = await parseStringPromise(xmlText);

    // 데이터가 없거나 에러가 났을 경우 예외 처리
    if (!result.dbs || !result.dbs.db) {
      throw new Error("KOPIS 데이터가 없습니다.");
    }

    // 4. 프론트엔드 Interface에 맞게 데이터 가공 (Mapping)
    const concertData = result.dbs.db.map((item: any) => ({
      id: item.mt20id[0], // KOPIS 고유 ID (예: PF178134)
      title: item.prfnm[0], // 공연명
      venue: item.fcltynm[0], // 공연장
      date: `${item.prfpdfrom[0]} ~ ${item.prfpdto[0]}`, // 시작일 ~ 종료일
      tag: item.genrenm[0], // 장르
      poster: item.poster[0], // 진짜 포스터 이미지 URL
      gradient: "from-slate-800 to-slate-900" // 포스터 없을 때 대비용
    }));

    return NextResponse.json({ success: true, data: concertData });
    
  } catch (error) {
    console.error("KOPIS 연동 에러:", error);
    // 에러 발생 시 앱이 터지지 않게 더미 데이터로 폴백 처리
    return NextResponse.json({ success: true, data: getFallbackData() });
  }
}

// 비상용 더미 데이터 함수
function getFallbackData() {
  return [
    { id: "PF001", title: "2026 홍대 인디 록 페스티벌", venue: "클럽 FF", date: "2026.07.03", tag: "ROCK", poster: "", gradient: "from-[#FF007F] to-purple-600" },
    { id: "PF002", title: "어쿠스틱 보야지 : 새벽의 노래", venue: "벨로주 홍대", date: "2026.06.20", tag: "ACOUSTIC", poster: "", gradient: "from-cyan-400 to-blue-600" },
    { id: "PF003", title: "Neon Jungle : 신스웨이브", venue: "롤링홀", date: "2026.06.25", tag: "SYNTH POP", poster: "", gradient: "from-[#00F5D4] to-indigo-600" },
  ];
}