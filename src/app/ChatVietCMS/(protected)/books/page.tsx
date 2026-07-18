import Link from "next/link";
import { getBooks, getCategories } from "@/lib/db";
import BooksTable from "@/components/admin/BooksTable";

export default async function AdminBooksPage() {
  const [books, categories] = await Promise.all([getBooks(), getCategories()]);
  const sorted = [...books].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-highlight">Sách ({books.length})</h1>
        <Link
          href="/ChatVietCMS/books/new"
          className="rounded-md bg-highlight px-4 py-2 text-sm font-medium text-[#01090C]"
        >
          + Thêm sách mới
        </Link>
      </div>
      <BooksTable books={sorted} categories={categories} />
    </div>
  );
}
