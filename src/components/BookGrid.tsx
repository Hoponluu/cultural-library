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

  const categoryById = useMemo(() => {
    const map = new Map<string, Category>();
    for (const c of categories) map.set(c.id, c);
    return map;
  }, [categories]);

  const visibleBooks = useMemo(() => {
    if (activeCategoryIds.length === 0) return books;
    return books.filter((b) =>
      b.categoryIds.some((id) => activeCategoryIds.includes(id))
    );
  }, [books, activeCategoryIds]);

  function toggleCategory(id: string) {
    setActiveCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  return (
    <div>
      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategoryIds([])}
            className={
              "rounded-full border px-3 py-1 text-sm transition " +
              (activeCategoryIds.length === 0
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-black/15 hover:border-black/40 dark:border-white/20 dark:hover:border-white/40")
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
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-black/15 hover:border-black/40 dark:border-white/20 dark:hover:border-white/40")
                }
              >
                {c.name}
              </button>
            );
          })}
        </div>
      )}

      {visibleBooks.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">
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
              <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
                <BookCover
                  src={book.thumbnail}
                  title={book.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="mt-2 line-clamp-2 text-sm font-medium">
                {book.title}
              </div>
              <div className="line-clamp-1 text-xs text-black/60 dark:text-white/60">
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl gap-6 overflow-y-auto rounded-xl bg-white p-6 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-40 shrink-0 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
          <BookCover src={book.thumbnail} title={book.title} />
        </div>
        <div className="flex flex-1 flex-col">
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <p className="mt-1 text-sm text-black/70 dark:text-white/70">
            Tác giả: {book.author || "—"}
          </p>
          <p className="text-sm text-black/70 dark:text-white/70">
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
                    className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs dark:bg-white/10"
                  >
                    {c.name}
                  </span>
                );
              })}
            </div>
          )}
          {book.description && (
            <p className="mt-4 text-sm leading-relaxed text-black/80 dark:text-white/80">
              {book.description}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between pt-4">
            {book.link ? (
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
              >
                Mua / Đọc sách
              </a>
            ) : (
              <span />
            )}
            <button
              onClick={onClose}
              className="text-sm text-black/60 hover:underline dark:text-white/60"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
