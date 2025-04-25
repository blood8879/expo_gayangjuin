/**
 * 날짜 유틸리티 함수 모음
 * Supabase에서 반환되는 날짜 문자열을 포맷팅하는 함수들을 제공합니다.
 */

/**
 * 날짜 문자열을 'YYYY-MM-DD' 형식으로 포맷팅합니다.
 * @param dateString Supabase에서 반환된 ISO 형식 날짜 문자열
 * @returns 포맷팅된 날짜 문자열
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "날짜 없음";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "날짜 없음";

    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error);
    return "날짜 없음";
  }
}

/**
 * 날짜 문자열을 'YYYY년 MM월 DD일' 형식으로 포맷팅합니다.
 * @param dateString Supabase에서 반환된 ISO 형식 날짜 문자열
 * @returns 포맷팅된 상세 날짜 문자열
 */
export function formatDetailDate(dateString?: string): string {
  if (!dateString) return "날짜 없음";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "날짜 없음";

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}년 ${month}월 ${day}일`;
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error);
    return "날짜 없음";
  }
}

/**
 * 날짜 문자열을 '요일'을 포함하여 포맷팅합니다.
 * @param dateString Supabase에서 반환된 ISO 형식 날짜 문자열
 * @returns 요일이 포함된 포맷팅된 날짜 문자열
 */
export function formatDateWithDay(dateString?: string): string {
  if (!dateString) return "날짜 없음";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "날짜 없음";

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const dayName = days[date.getDay()];

    return `${year}년 ${month}월 ${day}일 ${dayName}요일`;
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error);
    return "날짜 없음";
  }
}
