"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Book, Category } from "@/lib/types";
import BookCover from "@/components/BookCover";

export default function BookForm({
  categories,
  initialBook,
}: {
  categories: Category[];
  initialBook?: Book;
}) {
  const router = useRouter();
  const isEdit = Boolean(initialBook);

  const [title, setTitle] = useState(initialBook?.title ?? "");
  const [author, setAuthor] = useState(initialBook?.author ?? "");
  const [publisher, setPublisher] = useState(initialBook?.publisher ?? "");
  const [description, setDescription] = useState(initialBook?.description ?? "");
  const [link, setLink] = useState(initialBook?.link ?? "");
  const [categoryIds, setCategoryIds] = useState<string[]>(
    initialBook?.categoryIds ?? []
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    initialBook?.thumbnail ?? ""
  );
  const [removeThumbnail, setRemoveThumbnail] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function toggleCategory(id: string) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
    setRemoveThumbnail(false);
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("author", author);
    formData.set("publisher", publisher);
    formData.set("description", description);
    formData.set("link", link);
    for (const id of categoryIds) formData.append("categoryIds", id);
    if (thumbnailFile) formData.set("thumbnail", thumbnailFile);
    if (removeThumbnail) formData.set("removeThumbnail", "true");

    const url = isEdit ? `/api/admin/books/${initialBook!.id}` : "/api/admin/books";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Có lỗi xảy ra.");
      return;
    }

    router.push("/admin/books");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-1 block text-sm font-medium">Ảnh bìa (thumbnail)</label>
        <div className="flex items-center gap-4">
          <div className="h-32 w-24 shrink-0 overflow-hidden rounded border border-black/10 dark:border-white/10">
            <BookCover src={removeThumbnail ? "" : thumbnailPreview} title={title || "Bìa sách"} />
          </div>
          <div className="flex flex-col gap-2">
            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
            {isEdit && initialBook?.thumbnail && !thumbnailFile && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={removeThumbnail}
                  onChange={(e) => setRemoveThumbnail(e.target.checked)}
                />
                Xoá ảnh hiện tại
              </label>
            )}
          </div>
        </div>
      </div>

      <Field label="Tên sách" required>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Tác giả">
        <input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass} />
      </Field>

      <Field label="Nhà xuất bản">
        <input
          value={publisher}
          onChange={(e) => setPublisher(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Category">
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 && (
            <p className="text-sm text-black/50 dark:text-white/50">
              Chưa có category nào. Vào mục Category để thêm.
            </p>
          )}
          {categories.map((c) => {
            const active = categoryIds.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
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
      </Field>

      <Field label="Mô tả ngắn">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </Field>

      <Field label="Link mua / đọc">
        <input
          type="url"
          placeholder="https://..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className={inputClass}
        />
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm sách"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/books")}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium dark:border-white/20"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
