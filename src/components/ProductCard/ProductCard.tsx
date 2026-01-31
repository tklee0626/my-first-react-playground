import Card from '../Card/Card';
import Price from '../Price/Price';
import Rating from '../Rating/Rating';
import { Product } from '../../types/product';

export interface ProductCardProps extends Omit<Product, 'id'> {
  onClick?: () => void;
}

function ProductCard({
  image,
  brand,
  productName,
  price,
  originalPrice,
  reviewCount = 0,
  rating = 0,
  freeShipping,
  freeShippingCondition,
  onClick,
}: ProductCardProps) {
  return (
    <Card className={onClick ? 'cursor-pointer' : ''} onClick={onClick}>
      <Card.Image src={image} alt={productName} />
      <Card.Content>
        {/* 브랜드 */}
        <div className="text-xs text-gray-500 flex items-center gap-1">
          <span>{brand}</span>
          <span className="text-gray-400">&gt;</span>
        </div>

        {/* 제품명 */}
        <h3 className="text-sm text-gray-800 line-clamp-2 leading-tight">
          {productName}
        </h3>

        {/* 가격 */}
        <Price value={price} originalValue={originalPrice} className="mt-1" />

        {/* 무료배송 */}
        {freeShipping && (
          <div className="text-xs text-gray-500">
            {freeShippingCondition || '무료배송'}
          </div>
        )}

        {/* 리뷰 */}
        <Rating value={rating} count={reviewCount} className="mt-1" />
      </Card.Content>
    </Card>
  );
}

export default ProductCard;
