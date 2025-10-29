import { getCategories } from '@/actions/category.action';
import { TCategoryBasic } from '@repo/common';

// Server-side function to fetch all categories
export async function getAllCategories(): Promise<TCategoryBasic[]> {
  try {
    const response = await getCategories();
    return response.error ? [] : response || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Server-side function to fetch parent categories (no parentId)
export async function getParentCategories(): Promise<TCategoryBasic[]> {
  try {
    const response = await getCategories();
    const categories = response.error ? [] : response || [];
    // Filter categories that don't have a parent (top-level categories)
    return categories.filter((category) => !category.parentId);
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    return [];
  }
}

// Server-side function to fetch subcategories for a parent category
export async function getSubcategories(
  parentId: string,
): Promise<TCategoryBasic[]> {
  try {
    const response = await getCategories({ parentId });
    return response.error ? [] : response || [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

// Server-side function to fetch all categories with their subcategories
export async function getAllCategoriesWithSubcategories(): Promise<
  TCategoryBasic[]
> {
  try {
    const response = await getCategories();
    return response.error ? [] : response || [];
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }
}

// Recursive interface for nested subcategories
export interface CategoryWithSubcategories extends TCategoryBasic {
  subcategories: CategoryWithSubcategories[];
}

// Helper function to organize categories into parent-child structure with nested support
export function organizeCategoriesWithSubcategories(
  categories: TCategoryBasic[],
): CategoryWithSubcategories[] {
  const categoryMap = new Map<string, CategoryWithSubcategories>();
  const rootCategories: CategoryWithSubcategories[] = [];

  // Initialize all categories with empty subcategories array
  categories.forEach((cat) => {
    categoryMap.set(cat.id, { ...cat, subcategories: [] });
  });

  // Build the tree structure
  categories.forEach((cat) => {
    const currentCategory = categoryMap.get(cat.id);
    if (!currentCategory) return;

    if (cat.parentId) {
      const parentCategory = categoryMap.get(cat.parentId);
      if (parentCategory) {
        parentCategory.subcategories.push(currentCategory);
      }
    } else {
      // This is a root category
      rootCategories.push(currentCategory);
    }
  });

  return rootCategories;
}
