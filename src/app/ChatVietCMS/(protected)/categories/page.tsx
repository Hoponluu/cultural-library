import { getBooks, getCategories } from "@/lib/db";
import CategoriesManager from "@/components/admin/CategoriesManager";

export default async function AdminCategoriesPage() {
  const [categories, books] = await Promise.all([getCategories(), getBooks()]);

  const bookCountByCategory: Record<string, number> = {};
  for (const book of books) {
    for (const id of book.categoryIds) {
      bookCountByCategory[id] = (bookCountByCategory[id] ?? 0) + 1;
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-highlight">Category</h1>
      <CategoriesManager categories={categories} bookCountByCategory={bookCountByCategory} />
    </div>
  );
}
