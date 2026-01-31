# 계산기 페이지 구현 계획

## 개요
providence 프로젝트의 사칙연산 API를 활용하여 maputo React 프로젝트에 계산기 페이지를 구현합니다.

## 요구사항 정리
- **UI 스타일**: 기본 계산기 (숫자 버튼 + 연산자 버튼 그리드)
- **백엔드 연동**: providence API 호출 (localhost:3000)
- **라우팅**: `/calculator` 경로로 별도 페이지

## 참고 API (providence)
| 엔드포인트 | 메서드 | 파라미터 | 설명 |
|-----------|--------|----------|------|
| `/add` | GET | a, b | 덧셈 |
| `/minus` | GET | a, b | 뺄셈 |
| `/multiply` | GET | a, b | 곱셈 |
| `/divide` | GET | a, b | 나눗셈 |

## 구현 태스크

### 1. 라우팅 설정
- **파일**: `package.json`, `src/main.tsx`, `src/App.tsx`
- **작업**:
  - react-router-dom 설치
  - BrowserRouter 설정
  - `/` → 기존 ProductGrid 페이지
  - `/calculator` → 새 Calculator 페이지

### 2. API 서비스 레이어 생성
- **파일**: `src/services/calculatorApi.ts`
- **작업**:
  - fetch 기반 API 호출 함수
  - add, minus, multiply, divide 함수 구현
  - 에러 처리 포함

### 3. Calculator 컴포넌트 생성
- **파일**: `src/components/Calculator/Calculator.tsx`
- **작업**:
  - 디스플레이 영역 (현재 입력값, 결과)
  - 숫자 버튼 (0-9, 소수점)
  - 연산자 버튼 (+, -, ×, ÷)
  - 기능 버튼 (C, =)
  - Tailwind CSS 스타일링

### 4. Calculator 페이지 생성
- **파일**: `src/pages/CalculatorPage/CalculatorPage.tsx`
- **작업**:
  - Calculator 컴포넌트 래핑
  - 레이아웃 스타일링

### 5. 홈 페이지 분리
- **파일**: `src/pages/HomePage/HomePage.tsx`
- **작업**:
  - 기존 App.tsx의 ProductGrid 로직 이동

### 6. 네비게이션 추가
- **파일**: `src/components/Navigation/Navigation.tsx`
- **작업**:
  - 홈/계산기 페이지 간 이동 링크

## 디렉토리 구조 (최종)
```
src/
├── main.tsx                    # BrowserRouter 설정
├── App.tsx                     # 라우트 정의
├── components/
│   ├── Calculator/
│   │   └── Calculator.tsx      # 계산기 UI 컴포넌트
│   ├── Navigation/
│   │   └── Navigation.tsx      # 네비게이션 바
│   ├── Card/
│   ├── ProductCard/
│   ├── ProductGrid/
│   ├── Price/
│   └── Rating/
├── pages/
│   ├── HomePage/
│   │   └── HomePage.tsx        # 기존 제품 그리드 페이지
│   └── CalculatorPage/
│       └── CalculatorPage.tsx  # 계산기 페이지
├── services/
│   └── calculatorApi.ts        # API 호출 함수
└── types/
    └── product.ts
```

## 계산기 UI 레이아웃
```
┌─────────────────────────────┐
│                       0     │  ← 디스플레이
├───────┬───────┬───────┬─────┤
│   C   │  ±    │   %   │  ÷  │
├───────┼───────┼───────┼─────┤
│   7   │   8   │   9   │  ×  │
├───────┼───────┼───────┼─────┤
│   4   │   5   │   6   │  -  │
├───────┼───────┼───────┼─────┤
│   1   │   2   │   3   │  +  │
├───────┴───────┼───────┼─────┤
│       0       │   .   │  =  │
└───────────────┴───────┴─────┘
```

## 기술적 고려사항
- **CLAUDE.md 준수**: 배럴 파일 사용 금지, 직접 경로 import
- **Tailwind CSS**: 기존 프로젝트 스타일과 일관성 유지
- **TypeScript**: 타입 안전성 보장
- **에러 처리**: API 호출 실패 시 사용자 피드백
- **CORS**: providence 서버가 localhost:5173 허용 필요 (개발 시)

## 구현 순서
1. react-router-dom 설치
2. 라우팅 설정 (main.tsx, App.tsx)
3. API 서비스 생성
4. Calculator 컴포넌트 생성
5. 페이지 컴포넌트 생성 (HomePage, CalculatorPage)
6. Navigation 컴포넌트 생성
7. 통합 테스트
