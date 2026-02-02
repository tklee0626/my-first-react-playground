import axios from 'axios';
import { Product } from '../types/product';

const API_BASE_URL = 'http://localhost:3000';

export async function getProducts(): Promise<Product[]> {
  const response = await axios.get<Product[]>(`${API_BASE_URL}/products`);
  return response.data;
}

export async function createProduct(
  product: Omit<Product, 'id'>
): Promise<Product> {
  const response = await axios.post<Product>(
    `${API_BASE_URL}/products`,
    product
  );
  return response.data;
}

export async function updateProduct(
  id: number | string,
  product: Omit<Product, 'id'>
): Promise<Product> {
  const response = await axios.put<Product>(
    `${API_BASE_URL}/products/${id}`,
    product
  );
  return response.data;
}

export async function deleteProduct(id: number | string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/products/${id}`);
}

export async function reorderProducts(ids: (number | string)[]): Promise<void> {
  await axios.put(`${API_BASE_URL}/products/reorder`, { ids });
}
