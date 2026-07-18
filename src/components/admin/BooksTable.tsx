"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Book, Category } from "@/lib/types";
import BookCover from "@/components/BookCover";

export default function BooksTable({
  books,
  categories,
}: {
  books: Book[];
  categories: Category[];
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Xoá sách "${title}"? Hành động này không thể hoàn tác.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) router.refresh();
    else alert("Xoá thất bại.");
  }

  if (books.length === 0) {
    return (
      <p className="text-neutral-400">
        Chưa có sách nào. Bấm &ldquo;Thêm sách mới&rdquo; để bắt đầu.
      </p>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-neutral-800">
      {books.map((book) => (
        <div key={book.id} className="flex items-center gap-4 py-3">
          <div className="h-16 w-12 shrink-0">
            <BookCover src={book.thumbnail} title={book.title} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium text-neutral-100">{book.title}</div>
            <div className="truncate text-sm text-neutral-400">
              {book.author} {book.publisher && `· ${book.publisher}`}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {book.categoryIds.map((id) => {
                const c = categoryById.get(id);
                if (!c) return null;
                return (
                  <span
                    key={id}
                    className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-neutral-300"
                  >
                    {c.name}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3 text-sm">
            <Link
              href={`/ChatVietCMS/books/${book.id}/edit`}
              className="text-neutral-300 hover:text-highlight hover:underline"
            >
              Sửa
            </Link>
            <button
              onClick={() => handleDelete(book.id, book.title)}
              disabled={deletingId === book.id}
              className="text-red-400 hover:underline disabled:opacity-50"
            >
              {deletingId === book.id ? "Đang xoá..." : "Xoá"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
