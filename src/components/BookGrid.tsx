"use client";

import { useMemo, useState } from "react";
import type { Book, Category } from "@/lib/types";
import BookCover from "./BookCover";

export default function BookGrid({
  books,
  categories,
}: {
  books: Book[];
  categories: Category[];
}) {
  const [activeCategoryIds, setActiveCategoryIds] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [query, setQuery] = useState("");

  const categoryById = useMemo(() => {
    const map = new Map<string, Category>();
    for (const c of categories) map.set(c.id, c);
    return map;
  }, [categories]);

  const visibleBooks = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("vi");
    return books.filter((b) => {
      const matchesCategory =
        activeCategoryIds.length === 0 ||
        b.categoryIds.some((id) => activeCategoryIds.includes(id));
      const matchesQuery = !q || b.title.toLocaleLowerCase("vi").includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [books, activeCategoryIds, query]);

  function toggleCategory(id: string) {
    setActiveCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  return (
    <div>
      <div className="relative mb-6 max-w-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm sách theo tên..."
          className="w-full rounded-full border border-neutral-700 bg-transparent py-2 pl-9 pr-4 text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-highlight"
        />
      </div>

      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategoryIds([])}
            className={
              "rounded-full border px-3 py-1 text-sm transition " +
              (activeCategoryIds.length === 0
                ? "border-highlight bg-highlight text-[#01090C] font-medium"
                : "border-neutral-700 text-neutral-300 hover:border-highlight hover:text-highlight")
            }
          >
            Tất cả
          </button>
          {categories.map((c) => {
            const active = activeCategoryIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCategory(c.id)}
                className={
                  "rounded-full border px-3 py-1 text-sm transition " +
                  (active
                    ? "border-highlight bg-highlight text-[#01090C] font-medium"
                    : "border-neutral-700 text-neutral-300 hover:border-highlight hover:text-highlight")
                }
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      {visibleBooks.length === 0 ? (
        <p className="text-neutral-400">
          Không có sách nào phù hợp bộ lọc hiện tại.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visibleBooks.map((book) => (
            <button
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className="group flex flex-col text-left"
            >
              <div className="aspect-[3/4] w-full">
                <BookCover src={book.thumbnail} title={book.title} zoomOnHover />
              </div>
              <div className="mt-2 line-clamp-2 text-sm font-medium text-neutral-100">
                {book.title}
              </div>
              <div className="line-clamp-1 text-xs text-neutral-400">
                {book.author}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          categoryById={categoryById}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}

function BookDetailModal({
  book,
  categoryById,
  onClose,
}: {
  book: Book;
  categoryById: Map<string, Category>;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl gap-6 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-40 shrink-0">
          <BookCover src={book.thumbnail} title={book.title} />
        </div>
        <div className="flex flex-1 flex-col">
          <h2 className="text-xl font-semibold text-highlight">{book.title}</h2>
          <p className="mt-1 text-sm text-neutral-300">
            Tác giả: {book.author || "—"}
          </p>
          <p className="text-sm text-neutral-300">
            NXB: {book.publisher || "—"}
          </p>
          {book.categoryIds.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {book.categoryIds.map((id) => {
                const c = categoryById.get(id);
                if (!c) return null;
                return (
                  <span
                    key={id}
                    className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-neutral-200"
                  >
                    {c.name}
                  </span>
                );
              })}
            </div>
          )}
          {book.description && (
            <p className="mt-4 text-sm leading-relaxed text-neutral-300">
              {book.description}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between pt-4">
            {book.link ? (
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-highlight px-4 py-2 text-sm font-medium text-[#01090C]"
              >
                Mua / Đọc sách
              </a>
            ) : (
              <span />
            )}
            <button
              onClick={onClose}
              className="text-sm text-neutral-400 hover:text-highlight hover:underline"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
