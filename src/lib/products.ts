import type { Product } from '@/types';
import fs from 'fs/promises';
import path from 'path';

// This function should only be called on the server-side.
export async function getProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), 'src', 'data', 'products.json');
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(jsonData) as Product[];
    return products;
  } catch (error) {
    console.error('Failed to load products:', error);
    // In a real application, you might want to throw the error or handle it more gracefully.
    // For now, returning an empty array or a specific error product list might be options.
    return []; 
  }
}
