import { QueryClient } from "@tanstack/react-query";

// 기본 QueryClient 설정
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 캐시 기본 설정 - 5분
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      // 오류 발생 시 재시도 설정
      retry: 1,
      // 컴포넌트 마운트시 자동으로 쿼리 실행
      refetchOnMount: true,
      // 데이터 stale 상태가 되면 재요청
      refetchOnWindowFocus: "always",
    },
  },
});

// 레시피 관련 쿼리 키
export const recipeKeys = {
  all: ["recipes"] as const,
  lists: () => [...recipeKeys.all, "list"] as const,
  list: (filters: string) => [...recipeKeys.lists(), { filters }] as const,
  details: () => [...recipeKeys.all, "detail"] as const,
  detail: (id: string) => [...recipeKeys.details(), id] as const,
};

// 양조일지 관련 쿼리 키
export const journalKeys = {
  all: ["journals"] as const,
  lists: () => [...journalKeys.all, "list"] as const,
  list: (userId: string) => [...journalKeys.lists(), { userId }] as const,
  details: () => [...journalKeys.all, "detail"] as const,
  detail: (id: string) => [...journalKeys.details(), id] as const,
  records: (journalId: string) =>
    [...journalKeys.detail(journalId), "records"] as const,
  record: (journalId: string, recordId: string) =>
    [...journalKeys.records(journalId), recordId] as const,
};
