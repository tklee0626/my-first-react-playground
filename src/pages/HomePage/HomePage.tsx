import { useState, useEffect } from 'react';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { Product } from '../../types/product';
import { getProducts } from '../../services/productApi';

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => {
        console.error('Failed to load products:', err);
        setError('상품을 불러오는데 실패했습니다.');
      });
  }, []);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6">
      <ProductGrid products={products} />
    </div>
  );
}

export default HomePage;
