import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import ProductCard from '../ProductCard/ProductCard';
import SortableProductCard from './SortableProductCard';
import { Product } from '../../types/product';

export type { Product };

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 2 | 4 | 6 | 8;
  onProductClick?: (product: Product) => void;
  onReorder?: (products: Product[]) => void;
}

const COLUMN_CLASSES: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
};

const GAP_CLASSES: Record<number, string> = {
  2: 'gap-2',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
};

function ProductGrid({ products, columns = 5, gap = 4, onProductClick, onReorder }: ProductGridProps) {
  const [activeId, setActiveId] = useState<string | number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);

      const newProducts = [...products];
      const [removed] = newProducts.splice(oldIndex, 1);
      newProducts.splice(newIndex, 0, removed);

      onReorder?.(newProducts);
    }
  }

  const activeProduct = activeId ? products.find((p) => p.id === activeId) : null;

  // 드래그앤드롭이 활성화된 경우
  if (onReorder) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={products.map((p) => p.id)}
          strategy={rectSortingStrategy}
        >
          <div className={`grid ${COLUMN_CLASSES[columns]} ${GAP_CLASSES[gap]}`}>
            {products.map((product) => (
              <SortableProductCard
                key={product.id}
                product={product}
                onClick={onProductClick ? () => onProductClick(product) : undefined}
                isDragging={activeId === product.id}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeProduct ? (
            <div className="opacity-90 shadow-lg">
              <ProductCard
                image={activeProduct.image}
                brand={activeProduct.brand}
                productName={activeProduct.productName}
                price={activeProduct.price}
                originalPrice={activeProduct.originalPrice}
                reviewCount={activeProduct.reviewCount}
                rating={activeProduct.rating}
                freeShipping={activeProduct.freeShipping}
                freeShippingCondition={activeProduct.freeShippingCondition}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  }

  // 기본 모드 (드래그앤드롭 비활성화)
  return (
    <div className={`grid ${COLUMN_CLASSES[columns]} ${GAP_CLASSES[gap]}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onClick={onProductClick ? () => onProductClick(product) : undefined}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
