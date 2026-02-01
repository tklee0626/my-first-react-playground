# 상품 관리 페이지 구현 계획

## 목표
상품을 DB에 추가하고 수정하는 단일 페이지 구현

## 상품 Property (기존 Product 타입 기반)
```typescript
interface Product {
  id: number | string;
  image: string;
  brand: string;
  productName: string;
  price: number;
  originalPrice?: number;
  reviewCount?: number;
  rating?: number;
  freeShipping?: boolean;
  freeShippingCondition?: string;
}
```

## 구현 범위

### 프론트엔드 (my-react/melbourne)

#### 1. ProductAdminPage 컴포넌트
- 경로: `src/pages/ProductAdminPage/ProductAdminPage.tsx`
- 기능:
  - 상품 목록 표시
  - 상품 추가 폼
  - 상품 수정 폼 (목록에서 선택 시)

#### 2. productApi 서비스
- 경로: `src/services/productApi.ts`
- API 호출:
  - `GET /products` - 상품 목록 조회
  - `POST /products` - 상품 추가
  - `PUT /products/:id` - 상품 수정

#### 3. 라우팅 추가
- `App.tsx`에 `/admin/products` 경로 추가
- `Navigation.tsx`에 관리 페이지 링크 추가

### 백엔드 (my-first-app/jackson)

#### 4. ProductsController 확장
- `POST /products` - 상품 추가 엔드포인트
- `PUT /products/:id` - 상품 수정 엔드포인트

#### 5. Product Entity 생성
- MikroORM 엔티티 정의
- Migration 생성

## 작업 순서

1. **[백엔드]** Product 엔티티 생성 및 마이그레이션
2. **[백엔드]** ProductsController에 POST, PUT 엔드포인트 추가
3. **[프론트]** productApi 서비스 생성
4. **[프론트]** ProductAdminPage 컴포넌트 생성
5. **[프론트]** App.tsx 라우팅 추가
6. **[프론트]** Navigation에 링크 추가

## 기술 스택
- 프론트엔드: React + TypeScript + Tailwind CSS + axios
- 백엔드: NestJS + MikroORM + PostgreSQL
