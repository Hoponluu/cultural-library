import Link from "next/link";
import { getBooks, getCategories } from "@/lib/db";

export default async function AdminHomePage() {
  const [books, categories] = await Promise.all([getBooks(), getCategories()]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-highlight">Tổng quan</h1>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-800 p-4">
          <div className="text-2xl font-semibold text-neutral-100">{books.length}</div>
          <div className="text-sm text-neutral-400">Đầu sách</div>
        </div>
        <div className="rounded-lg border border-neutral-800 p-4">
          <div className="text-2xl font-semibold text-neutral-100">{categories.length}</div>
          <div className="text-sm text-neutral-400">Category</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/ChatVietCMS/books/new"
          className="rounded-md bg-highlight px-4 py-2 text-sm font-medium text-[#01090C]"
        >
          + Thêm sách mới
        </Link>
        <Link
          href="/ChatVietCMS/categories"
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-highlight hover:text-highlight"
        >
          Quản lý category
        </Link>
        <Link
          href="/ChatVietCMS/import-export"
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-highlight hover:text-highlight"
        >
          Import / Export CSV
        </Link>
        <Link
          href="/ChatVietCMS/settings"
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-highlight hover:text-highlight"
        >
          Cài đặt ảnh header
        </Link>
      </div>
    </div>
  );
}
