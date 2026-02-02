# 상품 삭제 기능 추가 계획

## 개요
상품 관리 페이지(ProductAdminPage)에 특정 상품을 삭제하는 기능을 추가합니다.
백엔드 API 서버(my-first-app/marseille)와 프론트엔드(my-react/surat) 양쪽 모두 수정이 필요합니다.

## 요구사항 정리
- 삭제 전 확인 다이얼로그 표시 (실수 방지)
- 삭제 버튼을 수정 버튼 옆에 배치
- 에러 발생 시 alert()로 알림
- 삭제 후 목록 자동 새로고침
- 삭제 성공 메시지 표시

---

## 작업 목록

### Task 1: 백엔드 API - DELETE 엔드포인트 추가 (my-first-app/marseille)

#### 1-1. ProductsService에 삭제 메서드 추가
**파일**: `src/products/products.service.ts`

```typescript
async remove(id: number): Promise<void> {
  const product = await this.em.findOneOrFail(Product, { id });
  await this.em.removeAndFlush(product);
}
```

**예상 변경**: 5줄 추가

#### 1-2. ProductsController에 DELETE 엔드포인트 추가
**파일**: `src/products/products.controller.ts`

```typescript
@Delete(':id')
async deleteProduct(@Param('id') id: number): Promise<void> {
  return this.productsService.remove(id);
}
```

**예상 변경**: 5줄 추가

---

### Task 2: 프론트엔드 API 함수 추가 (my-react/surat)
**파일**: `src/services/productApi.ts`

deleteProduct 함수 추가:
```typescript
export async function deleteProduct(id: number | string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/products/${id}`);
}
```

**예상 변경**: 5줄 추가

---

### Task 3: 프론트엔드 삭제 핸들러 함수 구현 (my-react/surat)
**파일**: `src/pages/ProductAdminPage/ProductAdminPage.tsx`

1. deleteProduct import 추가
2. handleDelete 함수 구현:
   - window.confirm()으로 삭제 확인
   - deleteProduct API 호출
   - 성공 시 alert로 성공 메시지 표시
   - 실패 시 alert로 에러 메시지 표시
   - loadProducts()로 목록 새로고침

```typescript
async function handleDelete(id: number | string) {
  if (!window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
    return;
  }

  try {
    await deleteProduct(id);
    alert('상품이 삭제되었습니다.');
    loadProducts();
  } catch (error) {
    alert('상품 삭제에 실패했습니다.');
    console.error(error);
  }
}
```

**예상 변경**: 15줄 추가

---

### Task 4: 프론트엔드 삭제 버튼 UI 추가 (my-react/surat)
**파일**: `src/pages/ProductAdminPage/ProductAdminPage.tsx`

상품 목록 테이블의 액션 열에 삭제 버튼 추가:
- 수정 버튼 옆에 배치
- 빨간색 스타일로 구분
- onClick에 handleDelete 연결

```tsx
<button
  onClick={() => handleDelete(product.id)}
  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
  삭제
</button>
```

**예상 변경**: 8줄 추가

---

## 파일 변경 요약

### 백엔드 (my-first-app/marseille)
| 파일 | 변경 내용 |
|------|----------|
| `src/products/products.service.ts` | remove() 메서드 추가 |
| `src/products/products.controller.ts` | DELETE /products/:id 엔드포인트 추가 |

### 프론트엔드 (my-react/surat)
| 파일 | 변경 내용 |
|------|----------|
| `src/services/productApi.ts` | deleteProduct 함수 추가 |
| `src/pages/ProductAdminPage/ProductAdminPage.tsx` | import, handleDelete, 삭제 버튼 추가 |

## 의존성
- 추가 패키지 설치 불필요
- 백엔드: 기존 MikroORM, NestJS 패턴 사용
- 프론트엔드: 기존 axios, React 패턴 사용

## 테스트 방법
1. `npm run dev`로 개발 서버 실행
2. `/admin/products` 페이지 접속
3. 상품 삭제 버튼 클릭
4. 확인 다이얼로그에서 "확인" 클릭
5. 성공 메시지 확인 및 목록에서 상품 제거 확인

---

## 리스크 및 고려사항
- 백엔드 API 서버 수정 후 재시작 필요
- 확인 다이얼로그는 브라우저 기본 confirm() 사용 (커스텀 모달 아님)
- 상품이 다른 테이블과 연관 관계가 있을 경우 삭제 실패 가능 (현재는 단독 테이블이므로 문제 없음)
