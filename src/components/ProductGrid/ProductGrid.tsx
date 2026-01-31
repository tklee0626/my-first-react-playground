import ProductCard from '../ProductCard/ProductCard';
import { Product } from '../../types/product';

export type { Product };

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 2 | 4 | 6 | 8;
  onProductClick?: (product: Product) => void;
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

function ProductGrid({ products, columns = 5, gap = 4, onProductClick }: ProductGridProps) {
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
