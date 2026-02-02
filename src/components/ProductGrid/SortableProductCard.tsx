import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ProductCard from '../ProductCard/ProductCard';
import { Product } from '../../types/product';

interface SortableProductCardProps {
  product: Product;
  onClick?: () => void;
  isDragging?: boolean;
}

function SortableProductCard({ product, onClick, isDragging: isCurrentlyDragging }: SortableProductCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: product.id });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isCurrentlyDragging ? 0.3 : 1,
    cursor: isCurrentlyDragging ? 'grabbing' : 'grab',
    touchAction: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProductCard
        image={product.image}
        brand={product.brand}
        productName={product.productName}
        price={product.price}
        originalPrice={product.originalPrice}
        reviewCount={product.reviewCount}
        rating={product.rating}
        freeShipping={product.freeShipping}
        freeShippingCondition={product.freeShippingCondition}
        onClick={onClick}
      />
    </div>
  );
}

export default SortableProductCard;
