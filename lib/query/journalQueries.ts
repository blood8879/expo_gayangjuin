import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Journal,
  JournalRecord,
  JournalImage,
  getJournals,
  saveJournal,
  getJournalById,
  updateJournal,
  deleteJournal,
  saveJournalRecord,
  updateJournalRecord,
  deleteJournalRecord,
  saveJournalImage,
  getJournalRecords,
  uploadJournalImage,
  listTables,
} from "../api/journal";
import { useAuth } from "../../contexts/AuthContext";

/**
 * 양조일지 목록을 가져오는 쿼리 훅
 */
export function useJournals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["journals", user?.id],
    queryFn: async () => {
      // 디버깅 메시지만 출력
      console.log("양조일지 데이터 조회 중...");

      return getJournals();
    },
    enabled: !!user?.id,
  });
}

/**
 * 양조일지 상세 정보를 가져오는 쿼리 훅
 */
export function useJournal(id: string) {
  return useQuery({
    queryKey: ["journal", id],
    queryFn: () => getJournalById(id),
    enabled: !!id,
  });
}

/**
 * 양조일지 생성을 위한 뮤테이션 훅
 */
export function useCreateJournal() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (journal: Omit<Journal, "id" | "user_id" | "created_at">) => {
      return saveJournal({
        ...journal,
        user_id: user?.id || "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}

/**
 * 양조일지 업데이트를 위한 뮤테이션 훅
 */
export function useUpdateJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, journal }: { id: string; journal: Partial<Journal> }) =>
      updateJournal(id, journal),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["journal", variables.id] });
    },
  });
}

/**
 * 양조일지 삭제를 위한 뮤테이션 훅
 */
export function useDeleteJournal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJournal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
    },
  });
}

/**
 * 양조일지 기록 생성을 위한 뮤테이션 훅
 */
export function useCreateJournalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (record: Omit<JournalRecord, "id" | "created_at">) =>
      saveJournalRecord(record),
    onSuccess: (_, variables) => {
      const { journal_id } = variables;
      queryClient.invalidateQueries({ queryKey: ["journal", journal_id] });
      queryClient.invalidateQueries({
        queryKey: ["journalRecords", journal_id],
      });
    },
  });
}

/**
 * 양조일지 기록 업데이트를 위한 뮤테이션 훅
 */
export function useUpdateJournalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      journalId,
      record,
    }: {
      id: string;
      journalId: string;
      record: Partial<JournalRecord>;
    }) => updateJournalRecord(id, record),
    onSuccess: (_, variables) => {
      const { journalId } = variables;
      queryClient.invalidateQueries({ queryKey: ["journal", journalId] });
      queryClient.invalidateQueries({
        queryKey: ["journalRecords", journalId],
      });
    },
  });
}

/**
 * 양조일지 기록 삭제를 위한 뮤테이션 훅
 */
export function useDeleteJournalRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, journalId }: { id: string; journalId: string }) =>
      deleteJournalRecord(id),
    onSuccess: (_, variables) => {
      const { journalId } = variables;
      queryClient.invalidateQueries({ queryKey: ["journal", journalId] });
      queryClient.invalidateQueries({
        queryKey: ["journalRecords", journalId],
      });
    },
  });
}

/**
 * 이미지 업로드를 위한 뮤테이션 훅
 */
export function useUploadJournalImage() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ file, journalId }: { file: File; journalId: string }) => {
      if (!user?.id) throw new Error("사용자 인증이 필요합니다");
      return uploadJournalImage(file, user.id, journalId);
    },
  });
}

/**
 * 양조일지 이미지 저장을 위한 뮤테이션 훅
 */
export function useSaveJournalImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (image: Omit<JournalImage, "id" | "created_at">) =>
      saveJournalImage(image),
    onSuccess: (_, variables) => {
      const { journal_id } = variables;
      queryClient.invalidateQueries({ queryKey: ["journal", journal_id] });
      queryClient.invalidateQueries({
        queryKey: ["journalRecords", journal_id],
      });
    },
  });
}

/**
 * 특정 양조일지의 모든 기록 조회를 위한 쿼리 훅
 */
export function useJournalRecords(journalId: string) {
  return useQuery({
    queryKey: ["journalRecords", journalId],
    queryFn: () => getJournalRecords(journalId),
    enabled: !!journalId,
  });
}
