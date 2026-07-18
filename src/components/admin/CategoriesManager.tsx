"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";

export default function CategoriesManager({
  categories,
  bookCountByCategory,
}: {
  categories: Category[];
  bookCountByCategory: Record<string, number>;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Có lỗi xảy ra.");
      return;
    }

    setName("");
    router.refresh();
  }

  async function handleDelete(id: string, catName: string) {
    const count = bookCountByCategory[id] ?? 0;
    const msg =
      count > 0
        ? `Xoá category "${catName}"? Category này đang gán cho ${count} sách, sẽ bị gỡ khỏi các sách đó.`
        : `Xoá category "${catName}"?`;
    if (!confirm(msg)) return;

    setDeletingId(id);
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) router.refresh();
    else alert("Xoá thất bại.");
  }

  return (
    <div className="max-w-xl">
      <form onSubmit={handleAdd} className="mb-6 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên category mới, vd: Khảo cổ học"
          className="flex-1 rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/40"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          Thêm
        </button>
      </form>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between py-3">
            <div>
              <span className="font-medium">{c.name}</span>
              <span className="ml-2 text-sm text-black/50 dark:text-white/50">
                {bookCountByCategory[c.id] ?? 0} sách
              </span>
            </div>
            <button
              onClick={() => handleDelete(c.id, c.name)}
              disabled={deletingId === c.id}
              className="text-sm text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
            >
              {deletingId === c.id ? "Đang xoá..." : "Xoá"}
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="py-3 text-sm text-black/60 dark:text-white/60">
            Chưa có category nào.
          </p>
        )}
      </div>
    </div>
  );
}
