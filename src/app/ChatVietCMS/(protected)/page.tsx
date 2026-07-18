import Link from "next/link";
import { getBooks, getCategories } from "@/lib/db";

export default async function AdminHomePage() {
  const [books, categories] = await Promise.all([getBooks(), getCategories()]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Tổng quan</h1>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
          <div className="text-2xl font-semibold">{books.length}</div>
          <div className="text-sm text-black/60 dark:text-white/60">Đầu sách</div>
        </div>
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
          <div className="text-2xl font-semibold">{categories.length}</div>
          <div className="text-sm text-black/60 dark:text-white/60">Category</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/ChatVietCMS/books/new"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          + Thêm sách mới
        </Link>
        <Link
          href="/ChatVietCMS/categories"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium dark:border-white/20"
        >
          Quản lý category
        </Link>
        <Link
          href="/ChatVietCMS/import-export"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium dark:border-white/20"
        >
          Import / Export CSV
        </Link>
      </div>
    </div>
  );
}
