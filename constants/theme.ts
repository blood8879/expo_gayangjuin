export const theme = {
  // 주 브랜드 색상 - 녹청색(teal)/남색 계열 (홈 브루잉, 술 양조의 청량감)
  primary: {
    DEFAULT: "#0a7ea4", // 기본 강조 색상
    light: "#5aacc9", // 밝은 버전
    dark: "#065670", // 어두운 버전
    gradient: ["#0a7ea4", "#1a93b8"], // 그라데이션
  },

  // 보조 브랜드 색상 - 자주/보라 계열 (와인, 전통주 색상 연상)
  secondary: {
    DEFAULT: "#8a4f7d", // 기본 보조 색상
    light: "#b87dab", // 밝은 버전
    dark: "#5e3554", // 어두운 버전
    gradient: ["#8a4f7d", "#9d6090"], // 그라데이션
  },

  // 성공, 경고, 오류, 정보 상태 색상
  status: {
    success: "#4ade80", // 성공 - 녹색
    warning: "#fbbf24", // 경고 - 노란색
    error: "#f87171", // 오류 - 빨간색
    info: "#60a5fa", // 정보 - 파란색
  },

  // 중립 색상 - 회색 톤
  neutral: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },

  // 백그라운드 색상
  background: {
    light: "#ffffff",
    dark: "#121212",
  },

  // 텍스트 색상
  text: {
    light: "#11181C", // 라이트 모드 텍스트
    dark: "#ECEDEE", // 다크 모드 텍스트
    dimmed: {
      light: "#687076", // 라이트 모드 흐린 텍스트
      dark: "#9BA1A6", // 다크 모드 흐린 텍스트
    },
  },

  // 그림자
  shadow: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
  },

  // 모서리 둥글기
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    "2xl": 24,
    full: 9999,
  },

  // 간격
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    "2xl": 48,
  },
};
