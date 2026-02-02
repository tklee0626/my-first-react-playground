# 상품 관리 페이지 정렬 기능 추가 계획

## 개요
홈 페이지의 드래그앤드롭 기능을 삭제하고, 상품 관리 페이지에서 정렬 기능을 추가합니다.
정렬 순서는 백엔드 DB에 저장되어 홈 페이지에 반영됩니다.

## 요구사항 정리
- 홈 페이지: 드래그앤드롭 삭제, 샘플 상품 삭제, DB 상품만 sortOrder 순서로 표시
- 상품 관리 페이지: 드래그앤드롭 정렬 + 서버 저장
- 백엔드: Product 테이블에 sortOrder 필드 추가, 정렬 순서 업데이트 API 추가

---

## 작업 목록

### Task 1: 백엔드 - Product 엔티티에 sortOrder 필드 추가
**파일**: `my-first-app/marseille/src/entities/product.entity.ts`

```typescript
@Property({ default: 0 })
sortOrder: number = 0;
```

---

### Task 2: 백엔드 - 마이그레이션 생성 및 실행
**명령어**:
```bash
npx mikro-orm migration:create
npx mikro-orm migration:up
```

---

### Task 3: 백엔드 - 정렬 순서 업데이트 API 추가
**파일**: `my-first-app/marseille/src/products/products.controller.ts`

```typescript
@Put('reorder')
async reorderProducts(@Body() body: { ids: number[] }): Promise<void> {
  return this.productsService.reorder(body.ids);
}
```

**파일**: `my-first-app/marseille/src/products/products.service.ts`

```typescript
async reorder(ids: number[]): Promise<void> {
  for (let i = 0; i < ids.length; i++) {
    const product = await this.productRepository.findOne({ id: ids[i] });
    if (product) {
      product.sortOrder = i;
    }
  }
  await this.productRepository.getEntityManager().flush();
}
```

---

### Task 4: 백엔드 - findAll을 sortOrder 순으로 정렬
**파일**: `my-first-app/marseille/src/products/products.service.ts`

```typescript
async findAll() {
  return this.productRepository.findAll({ orderBy: { sortOrder: 'ASC' } });
}
```

---

### Task 5: 프론트엔드 - Product 타입에 sortOrder 추가
**파일**: `my-react/surat/src/types/product.ts`

```typescript
export interface Product {
  // ... 기존 필드
  sortOrder?: number;
}
```

---

### Task 6: 프론트엔드 - 정렬 순서 저장 API 함수 추가
**파일**: `my-react/surat/src/services/productApi.ts`

```typescript
export async function reorderProducts(ids: (number | string)[]): Promise<void> {
  await axios.put(`${API_BASE_URL}/products/reorder`, { ids });
}
```

---

### Task 7: 프론트엔드 - 홈 페이지 단순화
**파일**: `my-react/surat/src/pages/HomePage/HomePage.tsx`

- 샘플 상품 배열 삭제
- 드래그앤드롭 관련 코드 삭제 (onReorder 제거)
- orderedProducts 상태 삭제, dbProducts만 사용

```typescript
function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <ProductGrid products={products} />
    </div>
  );
}
```

---

### Task 8: 프론트엔드 - 상품 관리 페이지에 드래그앤드롭 추가
**파일**: `my-react/surat/src/pages/ProductAdminPage/ProductAdminPage.tsx`

1. ProductGrid 컴포넌트 import
2. 테이블 대신 ProductGrid로 상품 목록 표시
3. onReorder 핸들러에서 reorderProducts API 호출
4. 수정/삭제 버튼은 별도 UI로 제공 (각 카드에 오버레이 또는 별도 섹션)

---

## 파일 변경 요약

### 백엔드 (my-first-app/marseille)
| 파일 | 변경 내용 |
|------|----------|
| `src/entities/product.entity.ts` | sortOrder 필드 추가 |
| `src/migrations/Migration*.ts` | 새 마이그레이션 파일 |
| `src/products/products.service.ts` | reorder(), findAll 정렬 추가 |
| `src/products/products.controller.ts` | PUT /products/reorder 엔드포인트 추가 |

### 프론트엔드 (my-react/surat)
| 파일 | 변경 내용 |
|------|----------|
| `src/types/product.ts` | sortOrder 필드 추가 |
| `src/services/productApi.ts` | reorderProducts 함수 추가 |
| `src/pages/HomePage/HomePage.tsx` | 단순화 (샘플 삭제, 드래그 삭제) |
| `src/pages/ProductAdminPage/ProductAdminPage.tsx` | 드래그앤드롭 정렬 추가 |

---

## 테스트 방법
1. 백엔드 마이그레이션 실행 후 서버 재시작
2. 상품 관리 페이지에서 드래그앤드롭으로 순서 변경
3. 홈 페이지에서 변경된 순서 확인
4. 새로고침 후에도 순서 유지 확인

---

## 리스크 및 고려사항
- 마이그레이션 시 기존 상품의 sortOrder는 0으로 초기화됨
- PUT /products/reorder 경로가 PUT /products/:id보다 먼저 매칭되도록 주의
