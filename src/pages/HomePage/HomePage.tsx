import { useState, useEffect } from 'react';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { Product } from '../../types/product';
import { getProducts } from '../../services/productApi';

const sampleProducts: Product[] = [
  {
    id: 1,
    image: 'https://placehold.co/300x300/1a1a1a/1a1a1a',
    brand: '포터',
    productName: 'FORCE SHOULDER BAG(S) (855-05 457)',
    price: 388000,
    freeShipping: true,
    freeShippingCondition: '조건부 무료배송',
    reviewCount: 137,
    rating: 5,
  },
  {
    id: 2,
    image: 'https://placehold.co/300x300/e8e8e8/e8e8e8',
    brand: '크로워치',
    productName: '나도 액세서리 백 - 멀 디아',
    price: 65000,
    freeShipping: true,
    freeShippingCondition: '조건부 무료배송',
    reviewCount: 1,
    rating: 5,
  },
  {
    id: 3,
    image: 'https://placehold.co/300x300/2a2a2a/2a2a2a',
    brand: '포터',
    productName: 'FORCE SHOULDER BAG (855-0741 5)',
    price: 438000,
    freeShipping: true,
    freeShippingCondition: '조건부 무료배송',
    reviewCount: 156,
    rating: 5,
  },
  {
    id: 4,
    image: 'https://placehold.co/300x300/1a2a3a/1a2a3a',
    brand: '포터',
    productName: 'FRAME SHOULDER BAG (S) (690-7848)',
    price: 338000,
    freeShipping: true,
    freeShippingCondition: '조건부 무료배송',
    reviewCount: 156,
    rating: 5,
  },
  {
    id: 5,
    image: 'https://placehold.co/300x300/3a3a3a/3a3a3a',
    brand: '포터',
    productName: 'FRAME SHOULDER BAG (690-1785 0)',
    price: 278000,
    freeShipping: true,
    freeShippingCondition: '조건부 무료배송',
    reviewCount: 155,
    rating: 5,
  },
];

function HomePage() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setDbProducts);
  }, []);

  const allProducts = [...sampleProducts, ...dbProducts];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <ProductGrid products={allProducts} />
    </div>
  );
}

export default HomePage;
