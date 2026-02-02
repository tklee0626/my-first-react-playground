export interface Product {
  id: number | string;
  image: string;
  brand: string;
  productName: string;
  price: number;
  originalPrice?: number;
  reviewCount?: number;
  rating?: number;
  freeShipping?: boolean;
  freeShippingCondition?: string;
  sortOrder?: number;
}
