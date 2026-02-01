import { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import { getProducts, createProduct, updateProduct } from '../../services/productApi';

function ProductAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    image: '',
    brand: '',
    productName: '',
    price: 0,
    originalPrice: 0,
    reviewCount: 0,
    rating: 5,
    freeShipping: false,
    freeShippingCondition: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const data = await getProducts();
    setProducts(data);
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? Number(value)
            : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingProduct) {
      await updateProduct(editingProduct.id, formData);
    } else {
      await createProduct(formData);
    }
    resetForm();
    loadProducts();
  }

  function handleEdit(product: Product) {
    setEditingProduct(product);
    setFormData({
      image: product.image,
      brand: product.brand,
      productName: product.productName,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      reviewCount: product.reviewCount || 0,
      rating: product.rating || 5,
      freeShipping: product.freeShipping || false,
      freeShippingCondition: product.freeShippingCondition || '',
    });
  }

  function resetForm() {
    setEditingProduct(null);
    setFormData({
      image: '',
      brand: '',
      productName: '',
      price: 0,
      originalPrice: 0,
      reviewCount: 0,
      rating: 5,
      freeShipping: false,
      freeShippingCondition: '',
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">상품 관리</h1>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editingProduct ? '상품 수정' : '상품 추가'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">이미지 URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">브랜드</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">상품명</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">가격</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">원래 가격</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">리뷰 수</label>
            <input
              type="number"
              name="reviewCount"
              value={formData.reviewCount}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">평점</label>
            <input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="freeShipping"
              checked={formData.freeShipping}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">무료배송</label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              배송 조건
            </label>
            <input
              type="text"
              name="freeShippingCondition"
              value={formData.freeShippingCondition}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingProduct ? '수정' : '추가'}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              취소
            </button>
          )}
        </div>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-4">상품 목록</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">브랜드</th>
              <th className="border p-2 text-left">상품명</th>
              <th className="border p-2 text-left">가격</th>
              <th className="border p-2 text-left">액션</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="border p-2">{product.id}</td>
                <td className="border p-2">{product.brand}</td>
                <td className="border p-2">{product.productName}</td>
                <td className="border p-2">
                  {product.price.toLocaleString()}원
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-500 hover:underline"
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductAdminPage;
