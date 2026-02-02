# 홈 페이지 드래그앤드롭 정렬 기능 추가 계획

## 개요
홈 페이지에서 상품 카드를 드래그앤드롭으로 순서를 변경할 수 있는 기능을 추가합니다.

## 요구사항 정리
- 라이브러리: @dnd-kit (가볍고 현대적, React 18 호환)
- 정렬 순서 저장: 안 함 (새로고침 시 원래 순서로 복원)
- 적용 범위: 홈 페이지에서만
- 대상: 모든 상품 (샘플 + DB 상품)

---

## 작업 목록

### Task 1: @dnd-kit 패키지 설치
**위치**: `my-react/surat`

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**패키지 설명**:
- `@dnd-kit/core`: 드래그앤드롭 핵심 기능
- `@dnd-kit/sortable`: 정렬 가능한 리스트 기능
- `@dnd-kit/utilities`: CSS 변환 유틸리티

---

### Task 2: ProductGrid 컴포넌트에 드래그앤드롭 기능 추가
**파일**: `src/components/ProductGrid/ProductGrid.tsx`

1. @dnd-kit 관련 import 추가
2. DndContext, SortableContext로 그리드 감싸기
3. sensors 설정 (마우스, 터치 지원)
4. onDragEnd 콜백을 props로 받기

```typescript
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
```

**Props 추가**:
- `onReorder?: (products: Product[]) => void` - 순서 변경 시 콜백

---

### Task 3: SortableProductCard 컴포넌트 생성
**파일**: `src/components/ProductGrid/SortableProductCard.tsx`

기존 ProductCard를 드래그 가능하게 감싸는 래퍼 컴포넌트:

```typescript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableProductCard({ product, onClick }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProductCard product={product} onClick={onClick} />
    </div>
  );
}
```

---

### Task 4: HomePage에서 상품 순서 상태 관리
**파일**: `src/pages/HomePage/HomePage.tsx`

1. allProducts를 useState로 관리
2. handleReorder 함수 구현
3. ProductGrid에 onReorder prop 전달

```typescript
const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);

useEffect(() => {
  const allProducts = [...sampleProducts, ...dbProducts];
  setOrderedProducts(allProducts);
}, [dbProducts]);

function handleReorder(newOrder: Product[]) {
  setOrderedProducts(newOrder);
}
```

---

## 파일 변경 요약

| 파일 | 변경 내용 |
|------|----------|
| `package.json` | @dnd-kit 패키지 추가 |
| `src/components/ProductGrid/ProductGrid.tsx` | DndContext, SortableContext 적용 |
| `src/components/ProductGrid/SortableProductCard.tsx` | 새 파일 - 드래그 가능한 카드 래퍼 |
| `src/pages/HomePage/HomePage.tsx` | 순서 상태 관리 및 handleReorder 추가 |

## 의존성
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities

## UX 동작
1. 사용자가 상품 카드를 드래그
2. 드래그 중 반투명 효과 (opacity: 0.5)
3. 드롭 위치로 상품 이동
4. 새로고침 시 원래 순서로 복원

## 테스트 방법
1. `npm install` 후 `npm run dev`
2. 홈 페이지 접속
3. 상품 카드 드래그하여 순서 변경
4. 새로고침 후 원래 순서 복원 확인

---

## 리스크 및 고려사항
- 모바일 터치 드래그 지원 (PointerSensor 사용)
- 그리드 레이아웃에서 드래그 시 시각적 피드백 필요
- 키보드 접근성 지원 (KeyboardSensor)
