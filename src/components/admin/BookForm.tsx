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

    router.push("/ChatVietCMS/books");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-300">Ảnh bìa (thumbnail)</label>
        <div className="flex items-center gap-4">
          <div className="h-32 w-24 shrink-0 overflow-hidden rounded border border-neutral-800">
            <BookCover src={removeThumbnail ? "" : thumbnailPreview} title={title || "Bìa sách"} />
          </div>
          <div className="flex flex-col gap-2">
            <input type="file" accept="image/*" onChange={handleThumbnailChange} className="text-neutral-300" />
            {isEdit && initialBook?.thumbnail && !thumbnailFile && (
              <label className="flex items-center gap-2 text-sm text-neutral-300">
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
            <p className="text-sm text-neutral-500">
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
                    ? "border-highlight bg-highlight text-[#01090C] font-medium"
                    : "border-neutral-700 text-neutral-300 hover:border-highlight hover:text-highlight")
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

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-highlight px-4 py-2 text-sm font-medium text-[#01090C] disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Thêm sách"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/ChatVietCMS/books")}
          className="rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-highlight hover:text-highlight"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm text-neutral-100 outline-none focus:border-highlight";

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
      <label className="mb-1 block text-sm font-medium text-neutral-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}
