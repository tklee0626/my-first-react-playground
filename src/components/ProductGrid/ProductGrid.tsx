import ProductCard, { ProductCardProps } from '../ProductCard/ProductCard';

export interface Product extends ProductCardProps {
  id: number | string;
}

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4 | 5 | 6;
  gap?: 2 | 4 | 6 | 8;
  onProductClick?: (product: Product) => void;
}

function ProductGrid({ products, columns = 5, gap = 4, onProductClick }: ProductGridProps) {
  const columnClasses: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
  };

  const gapClasses: Record<number, string> = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]}`}>
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
