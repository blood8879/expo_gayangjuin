# Product Manager

## 프로젝트 개요
- **프로젝트명**: 전통주 양조 기록 앱 (expo-gayangjuin)
- **타겟 플랫폼**: iOS/Android 모바일 앱
- **주요 기능**: 전통주 레시피 기록, 양조 일지 관리, 사용자 인증

## 필수 요구사항
- Expo SDK ~52.0 기반의 크로스 플랫폼 모바일 앱
- Supabase를 백엔드로 사용한 실시간 데이터베이스 및 인증
- 소셜 로그인 지원 (카카오)
- 반응형 UI/UX 디자인

## 주요 기능 명세
- 사용자 인증 (카카오 OAuth)
- 전통주 레시피 CRUD
- 양조 일지 기록 및 관리
- 성인 인증 기능
- 다크/라이트 모드 지원

# UX/UI Designer

## 디자인 시스템
- **색상 팔레트**: 전통주 컨셉 (자주색/보라색 계열)
- **타이포그래피**: 시스템 폰트 기반
- **아이콘**: Expo Vector Icons (Ionicons)
- **컴포넌트**: 재사용 가능한 UI 컴포넌트 시스템

## 필수 요구사항
- **스타일링**: NativeWind (Tailwind CSS) 사용, **inline style 금지**
- 다크/라이트 모드 지원 (`useColorScheme` 훅 활용)
- 접근성 고려 (SafeAreaView 등)
- 반응형 디자인 (다양한 화면 크기 대응)

## 주요 UI 컴포넌트
- ThemedText, ThemedView (테마 지원)
- Button 컴포넌트 (ui/Button)
- Collapsible 컴포넌트
- ParallaxScrollView
- 모달 및 다이얼로그

## 디자인 가이드라인
- 그라데이션 사용 (expo-linear-gradient)
- 햅틱 피드백 (expo-haptics)
- 부드러운 애니메이션 (react-native-reanimated)

# Frontend Developer

## 기술 스택
- **프레임워크**: React Native with Expo SDK ~52.0
- **언어**: TypeScript
- **라우팅**: Expo Router (파일 기반 라우팅)
- **스타일링**: NativeWind (Tailwind CSS) - **inline style 금지**
- **상태 관리**: React Context API + React Query
- **애니메이션**: React Native Reanimated

## 필수 요구사항
- Expo 개발 환경 설정 및 EAS Build 구성
- TypeScript 타입 안정성 확보
- **NativeWind 사용 (inline style 절대 금지)**
- 크로스 플랫폼 호환성 (iOS/Android)
- 성능 최적화 (React.memo, useMemo, useCallback)

## 주요 개발 영역
- 컴포넌트 아키텍처 설계 (재사용성, 확장성)
- 커스텀 훅 개발 (useAuth, useColorScheme, useThemeColor)
- 에러 바운더리 및 예외 처리
- 이미지 처리 (expo-image-picker)
- 푸시 알림 (향후 확장)

## 코드 품질 관리
- ESLint 및 Prettier 설정
- Jest 단위 테스트
- TypeScript 엄격 모드
- 컴포넌트 문서화

## 주요 라이브러리
```json
{
  "@tanstack/react-query": "상태 관리",
  "expo-router": "네비게이션",
  "react-native-reanimated": "애니메이션",
  "nativewind": "스타일링",
  "expo-linear-gradient": "그라데이션",
  "expo-haptics": "햅틱 피드백"
}
```

# Backend Developer

## 기술 스택
- **백엔드**: Supabase (PostgreSQL + 실시간 기능)
- **인증**: Supabase Auth (OAuth 2.0)
- **데이터베이스**: PostgreSQL with Supabase
- **스토리지**: Supabase Storage (이미지 업로드)
- **실시간**: Supabase Realtime

## 필수 요구사항
- Supabase 프로젝트 설정 및 환경 변수 관리
- Row Level Security (RLS) 정책 구현
- 데이터베이스 스키마 설계 및 마이그레이션
- OAuth 프로바이더 설정 (카카오)

## 주요 개발 영역
- 사용자 인증 시스템 (소셜 로그인)
- 데이터베이스 스키마 설계
- API 엔드포인트 설계
- 파일 업로드 및 스토리지 관리
- 실시간 데이터 동기화

## 데이터베이스 구조
- 사용자 프로필 테이블
- 레시피 테이블
- 양조 일지 테이블
- 이미지 메타데이터 테이블

## 보안 요구사항
- RLS (Row Level Security) 구현
- JWT 토큰 관리
- CORS 설정
- 환경 변수 보안 관리

# DevOps Engineer

## 인프라 환경
- **플랫폼**: Expo Application Services (EAS)
- **배포**: EAS Build & EAS Submit
- **백엔드**: Supabase (관리형 서비스)
- **버전 관리**: Git (GitHub)

## 필수 요구사항
- EAS 프로젝트 설정 및 빌드 구성
- iOS/Android 앱스토어 배포 파이프라인
- 환경별 설정 관리 (development, staging, production)
- 코드 서명 및 키 관리

## 주요 설정 파일
- `eas.json`: EAS 빌드 구성
- `app.json`: Expo 앱 구성
- `google-services.json`: Firebase/Google 서비스 설정
- 키스토어 파일들: Android 서명

## CI/CD 파이프라인
- 자동화된 빌드 프로세스
- 앱스토어 자동 배포
- 환경 변수 관리
- 버전 관리 및 릴리즈 노트

## 모니터링 및 분석
- Expo Analytics
- 크래시 리포팅
- 성능 모니터링
- 사용자 행동 분석

# QA Engineer

## 테스트 환경
- **단위 테스트**: Jest + React Native Testing Library
- **E2E 테스트**: Detox (향후 도입 예정)
- **디바이스 테스트**: 실제 iOS/Android 기기
- **시뮬레이터**: iOS Simulator, Android Emulator

## 필수 요구사항
- 크로스 플랫폼 호환성 테스트 (iOS/Android)
- 다양한 화면 크기 대응 테스트
- 소셜 로그인 플로우 테스트
- 성인 인증 기능 테스트
- 오프라인 상태 처리 테스트

## 주요 테스트 영역
- 사용자 인증 플로우
- 데이터 CRUD 작업
- 이미지 업로드 기능
- 네트워크 에러 처리
- 메모리 누수 및 성능

## 테스트 시나리오
- 회원가입/로그인 플로우
- 레시피 등록/수정/삭제
- 양조 일지 기록
- 다크/라이트 모드 전환
- 앱 백그라운드/포그라운드 전환

## 성능 테스트
- 앱 실행 시간
- 메모리 사용량
- 배터리 소모량
- 네트워크 사용량

# Technical Writer

## 문서화 요구사항
- **개발 문서**: 설치, 설정, API 문서
- **사용자 문서**: 앱 사용법, FAQ
- **코드 문서**: 컴포넌트, 훅, API 문서화
- **아키텍처 문서**: 시스템 구조 및 데이터 플로우

## 필수 작업
- README.md 업데이트 및 유지보수
- 코드 주석 작성 (TypeScript JSDoc)
- API 엔드포인트 문서화
- 배포 가이드 작성

## 문서 구조
```
docs/
├── plan.md - 프로젝트 계획서
├── database.md - 데이터베이스 스키마
├── USECASE.md - 사용 사례
├── PRD.md - 제품 요구사항 명세서
├── SETUP.md - 개발 환경 설정
└── IA.md - 정보 아키텍처
```

## 기술 스택 문서화
- Expo 설정 및 환경 구성
- Supabase 백엔드 설정
- NativeWind 스타일링 가이드
- React Query 상태 관리 패턴

# Project Manager

## 프로젝트 관리 도구
- **이슈 트래킹**: GitHub Issues
- **버전 관리**: Git/GitHub
- **문서 관리**: Markdown 기반 문서
- **커뮤니케이션**: 개발팀 내 협업

## 필수 관리 영역
- 개발 일정 관리 및 마일스톤 설정
- 기능 요구사항 정의 및 우선순위 관리
- 팀 간 커뮤니케이션 조율
- 품질 관리 및 배포 일정 관리

## 주요 책임사항
- 프로젝트 범위 관리
- 리스크 관리 및 이슈 해결
- 스테이크홀더와의 커뮤니케이션
- 진행 상황 보고 및 문서화

## 개발 프로세스
- Agile/Scrum 방법론 적용
- 스프린트 계획 및 회고
- 코드 리뷰 프로세스 관리
- 배포 및 릴리즈 관리

## 품질 관리
- 코드 품질 기준 설정
- 테스트 커버리지 관리
- 성능 기준 설정 및 모니터링
- 사용자 피드백 수집 및 반영