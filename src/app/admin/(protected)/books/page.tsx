import Link from "next/link";
import { getBooks, getCategories } from "@/lib/db";
import BooksTable from "@/components/admin/BooksTable";

export default async function AdminBooksPage() {
  const [books, categories] = await Promise.all([getBooks(), getCategories()]);
  const sorted = [...books].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sách ({books.length})</h1>
        <Link
          href="/admin/books/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          + Thêm sách mới
        </Link>
      </div>
      <BooksTable books={sorted} categories={categories} />
    </div>
  );
}
