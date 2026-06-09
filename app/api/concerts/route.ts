import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 프론트엔드로 보내줄 순수 더미 데이터
    const mockData = [
      { id: 101, title: "2026 홍대 인디 록 페스티벌", venue: "클럽 FF", date: "2026.07.03", tag: "ROCK", gradient: "from-[#FF007F] to-purple-600" },
      { id: 102, title: "어쿠스틱 보야지 : 새벽의 노래", venue: "벨로주 홍대", date: "2026.06.20", tag: "ACOUSTIC", gradient: "from-cyan-400 to-blue-600" },
      { id: 103, title: "Neon Jungle : 신스웨이브 나이트", venue: "롤링홀", date: "2026.06.25", tag: "SYNTH POP", gradient: "from-[#00F5D4] to-indigo-600" },
      { id: 104, title: "한여름 밤의 꿈 (Midsummer)", venue: "상상마당", date: "2026.07.10", tag: "INDIE POP", gradient: "from-amber-400 to-pink-500" },
      { id: 105, title: "블루스 스테이션 라이브", venue: "클럽 에반스", date: "2026.07.15", tag: "BLUES", gradient: "from-blue-500 to-indigo-900" },
      { id: 106, title: "인디 팝 유니버스", venue: "프리버드", date: "2026.07.22", tag: "POP", gradient: "from-emerald-400 to-teal-600" },
      { id: 107, title: "모던 록 익스프레스", venue: "무대륙", date: "2026.07.30", tag: "MODERN ROCK", gradient: "from-rose-400 to-red-600" }
    ];

    // 데이터를 JSON 형태로 프론트엔드에 전달
    return NextResponse.json({ success: true, data: mockData });
    
  } catch (error) {
    return NextResponse.json({ success: false, message: "공연 데이터를 가져오는데 실패했습니다." }, { status: 500 });
  }
}