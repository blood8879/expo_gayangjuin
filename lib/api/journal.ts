import { supabase } from "../supabase";

// 양조일지 인터페이스 - 데이터베이스 스키마와 일치하도록 정의
export interface Journal {
  id?: string;
  title: string;
  description: string; // memo -> description으로 변경
  recipe_id?: string;
  current_stage?: number; // stage_id -> current_stage으로 변경
  user_id: string;
  created_at?: string;
  updated_at?: string;
  cover_image_url?: string;
}

// 양조일지 기록 인터페이스
export interface JournalRecord {
  id?: string;
  journal_id: string;
  temperature: number;
  gravity: number; // humidity -> gravity로 변경
  notes: string;
  created_at?: string;
  updated_at?: string;
  journal_entry_id?: string; // record_id -> journal_entry_id로 변경
}

// 양조일지 이미지 인터페이스
export interface JournalImage {
  id?: string;
  journal_entry_id: string; // record_id -> journal_entry_id로 변경
  image_url: string;
  created_at?: string;
  description?: string; // 스키마에 description 컬럼 추가됨
}

// UI에서 사용하는 양조일지 데이터 타입
export type JournalFormData = {
  title: string;
  description: string;
  recipe_id?: string;
  current_stage?: number;
  is_completed?: boolean;
};

// UI에서 사용하는 양조일지 기록 데이터 타입
export interface RecordFormData {
  title: string;
  note: string; // memo -> note로 변경
  temperature?: number;
  gravity?: number; // humidity -> gravity로 변경
  entry_date?: string;
  images?: string[]; // 이미지 URL 배열
}

/**
 * 양조일지 저장 함수
 */
export async function saveJournal(journal: Omit<Journal, "id" | "created_at">) {
  console.log("저널 저장 시도:", journal);

  // 스키마 디버깅
  try {
    const { data: journalSchema } = await supabase
      .from("journals")
      .select()
      .limit(1);

    if (journalSchema && journalSchema.length > 0) {
      console.log("JOURNALS TABLE SCHEMA:", Object.keys(journalSchema[0]));
    } else {
      console.log("journals 테이블에서 스키마를 불러올 수 없습니다.");

      // 테이블 존재 여부 확인
      const { data: tableList } = await supabase.rpc("list_tables");

      console.log("사용 가능한 테이블 목록:", tableList);
    }
  } catch (e) {
    console.error("Schema inspection failed:", e);
  }

  const { data, error } = await supabase
    .from("journals")
    .insert([journal])
    .select();

  if (error) {
    console.error("저널 저장 에러:", error);
    throw error;
  }

  console.log("저널 저장 성공:", data?.[0]);
  return data?.[0];
}

/**
 * 양조일지 기록 저장 함수
 */
export async function saveJournalRecord(
  record: Omit<JournalRecord, "id" | "created_at">
) {
  console.log("저널 기록 저장 시도:", record);

  // 스키마 디버깅
  try {
    const { data: entrySchema } = await supabase
      .from("journal_entries")
      .select()
      .limit(1);

    if (entrySchema && entrySchema.length > 0) {
      console.log("JOURNAL_ENTRIES TABLE SCHEMA:", Object.keys(entrySchema[0]));
    } else {
      console.log("journal_entries 테이블에서 스키마를 불러올 수 없습니다.");
    }
  } catch (e) {
    console.error("Schema inspection failed:", e);
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .insert([record])
    .select();

  if (error) {
    console.error("저널 기록 저장 에러:", error);
    throw error;
  }

  console.log("저널 기록 저장 성공:", data?.[0]);
  return data?.[0];
}

/**
 * 양조일지 목록 조회 함수
 */
export async function getJournals() {
  console.log("저널 목록 조회 시도");

  const { data, error } = await supabase
    .from("journals")
    .select(
      `
      *,
      recipes:recipe_id (
        id,
        name,
        type,
        description
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("저널 목록 조회 에러:", error);
    throw error;
  }

  console.log(`총 ${data?.length || 0}개의 저널 목록 조회 성공`);
  return data;
}

/**
 * 양조일지 상세 조회 함수
 */
export async function getJournalById(id: string) {
  console.log(`ID: ${id}로 저널 상세 조회 시도`);

  const { data, error } = await supabase
    .from("journals")
    .select(
      `
      *,
      recipes:recipe_id (
        id,
        name,
        type,
        description,
        recipe_stages(*)
      ),
      journal_entries(
        *,
        journal_images(*)
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("저널 상세 조회 에러:", error);
    throw error;
  }

  console.log("저널 상세 조회 성공:", data);
  return data;
}

/**
 * 양조일지 업데이트 함수
 */
export async function updateJournal(id: string, journal: Partial<Journal>) {
  console.log(`ID: ${id}의 저널 업데이트 시도`, journal);

  const { data, error } = await supabase
    .from("journals")
    .update(journal)
    .eq("id", id)
    .select();

  if (error) {
    console.error("저널 업데이트 에러:", error);
    throw error;
  }

  console.log("저널 업데이트 성공:", data?.[0]);
  return data?.[0];
}

/**
 * 양조일지 기록 업데이트 함수
 */
export async function updateJournalRecord(
  id: string,
  record: Partial<JournalRecord>
) {
  console.log(`ID: ${id}의 저널 기록 업데이트 시도`, record);

  const { data, error } = await supabase
    .from("journal_entries")
    .update(record)
    .eq("id", id)
    .select();

  if (error) {
    console.error("저널 기록 업데이트 에러:", error);
    throw error;
  }

  console.log("저널 기록 업데이트 성공:", data?.[0]);
  return data?.[0];
}

/**
 * 양조일지 삭제 함수
 */
export async function deleteJournal(id: string) {
  console.log(`ID: ${id}의 저널 삭제 시도`);

  const { error } = await supabase.from("journals").delete().eq("id", id);

  if (error) {
    console.error("저널 삭제 에러:", error);
    throw error;
  }

  console.log(`ID: ${id}의 저널 삭제 성공`);
  return true;
}

/**
 * 양조일지 기록 삭제 함수
 */
export async function deleteJournalRecord(id: string) {
  console.log(`ID: ${id}의 저널 기록 삭제 시도`);

  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("저널 기록 삭제 에러:", error);
    throw error;
  }

  console.log(`ID: ${id}의 저널 기록 삭제 성공`);
  return true;
}

/**
 * 양조일지 이미지 저장 함수
 */
export async function saveJournalImage(
  image: Omit<JournalImage, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from("journal_images")
    .insert([image])
    .select();

  if (error) {
    console.error("저널 이미지 저장 에러:", error);
    throw error;
  }

  return data?.[0];
}

/**
 * 양조일지 특정 저널의 모든 기록 가져오기
 */
export async function getJournalRecords(journalId: string) {
  console.log(`저널 ID: ${journalId}의 모든 기록 조회 시도`);

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*, journal_images(*)")
    .eq("journal_id", journalId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("저널 기록 조회 에러:", error);
    throw error;
  }

  console.log(`저널 ID: ${journalId}의 기록 ${data?.length || 0}개 조회 성공`);
  return data;
}

/**
 * 양조일지 이미지 업로드 함수
 * 이미지 데이터를 Storage에 업로드하고 URL을 반환
 */
export async function uploadJournalImage(
  file: File,
  userId: string,
  journalId: string
) {
  console.log(`저널 ID: ${journalId}의 이미지 업로드 시도`);

  const filePath = `journal_images/${userId}/${journalId}/${Date.now()}_${
    file.name
  }`;
  const { data, error } = await supabase.storage
    .from("journal-images")
    .upload(filePath, file);

  if (error) {
    console.error("저널 이미지 업로드 에러:", error);
    throw error;
  }

  // 업로드된 이미지의 공개 URL 가져오기
  const { data: publicURL } = supabase.storage
    .from("journal-images")
    .getPublicUrl(filePath);

  console.log("저널 이미지 업로드 성공:", publicURL);
  return publicURL.publicUrl;
}

/**
 * 데이터베이스 테이블 목록 조회 함수 (디버깅용)
 * 현재 미사용 - 데이터베이스에 해당 함수가 존재하지 않기 때문에 오류 발생
 */
export async function listTables() {
  try {
    console.log("테이블 목록 조회 시도 - 이 기능은 현재 지원되지 않습니다.");
    return [];
  } catch (e) {
    console.error("테이블 목록 조회 시도 중 오류 발생 (무시됨):", e);
    return [];
  }
}
