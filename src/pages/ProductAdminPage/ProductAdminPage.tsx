import { useState, useEffect, useMemo } from 'react';
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Product } from '../../types/product';
import { getProducts, createProduct, updateProduct, deleteProduct, reorderProducts } from '../../services/productApi';

function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 60%, 70%)`;
}

function Thumbnail({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);
  const fallbackColor = useMemo(() => generateRandomColor(), []);

  if (hasError || !src) {
    return (
      <div
        className="w-12 h-12 flex items-center justify-center rounded text-xs text-white"
        style={{ backgroundColor: fallbackColor }}
      >
        {alt.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-12 h-12 object-cover rounded"
      onError={() => setHasError(true)}
    />
  );
}

interface SortableRowProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (id: number | string) => void;
}

function SortableRow({ product, index, onEdit, onDelete }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging ? '#f3f4f6' : undefined,
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td className="border p-2 cursor-grab" {...attributes} {...listeners}>
        ⠿ {index + 1}
      </td>
      <td className="border p-2">
        <Thumbnail src={product.image} alt={product.productName} />
      </td>
      <td className="border p-2">{product.id}</td>
      <td className="border p-2">{product.brand}</td>
      <td className="border p-2">{product.productName}</td>
      <td className="border p-2">{product.price.toLocaleString()}원</td>
      <td className="border p-2">
        <button
          onClick={() => onEdit(product)}
          className="text-blue-500 hover:underline"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </td>
    </tr>
  );
}

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

  async function handleDelete(id: number | string) {
    if (!window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteProduct(id);
      alert('상품이 삭제되었습니다.');
      loadProducts();
    } catch (error) {
      alert('상품 삭제에 실패했습니다.');
      console.error(error);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);

      const previousProducts = [...products];
      const newProducts = [...products];
      const [removed] = newProducts.splice(oldIndex, 1);
      newProducts.splice(newIndex, 0, removed);

      setProducts(newProducts);

      try {
        await reorderProducts(newProducts.map((p) => p.id));
      } catch (error) {
        setProducts(previousProducts);
        alert('순서 저장에 실패했습니다.');
        console.error(error);
      }
    }
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
        <h2 className="text-lg font-semibold mb-4">상품 목록 (⠿ 드래그하여 순서 변경)</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={products.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">순서</th>
                  <th className="border p-2 text-left">이미지</th>
                  <th className="border p-2 text-left">ID</th>
                  <th className="border p-2 text-left">브랜드</th>
                  <th className="border p-2 text-left">상품명</th>
                  <th className="border p-2 text-left">가격</th>
                  <th className="border p-2 text-left">액션</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <SortableRow
                    key={product.id}
                    product={product}
                    index={index}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

export default ProductAdminPage;
