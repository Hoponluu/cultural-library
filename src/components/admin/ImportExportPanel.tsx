"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ImportExportPanel() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{
    created: number;
    updated: number;
    errors: string[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setImporting(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.set("file", file);

    const res = await fetch("/api/admin/import", { method: "POST", body: formData });
    setImporting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Import thất bại.");
      return;
    }

    const data = await res.json();
    setResult(data);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="flex max-w-xl flex-col gap-10">
      <section>
        <h2 className="mb-2 text-lg font-semibold text-highlight">Export</h2>
        <p className="mb-3 text-sm text-neutral-400">
          Tải toàn bộ dữ liệu sách hiện tại ra file CSV.
        </p>
        <a
          href="/api/admin/export"
          className="inline-block rounded-md border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-highlight hover:text-highlight"
        >
          Tải file CSV
        </a>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-highlight">Import</h2>
        <p className="mb-3 text-sm text-neutral-400">
          Import hàng loạt sách từ file CSV. Cột: <code>id, title, author, publisher,
          thumbnail, description, link, categories</code> (categories cách nhau bằng
          dấu chấm phẩy &ldquo;;&rdquo;). Nếu <code>id</code> khớp với sách đã có, sách đó
          sẽ được cập nhật; nếu không, sách mới sẽ được tạo. Category chưa tồn tại sẽ
          được tự động tạo mới.
        </p>
        <form onSubmit={handleImport} className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            required
            className="text-neutral-300"
          />
          <button
            type="submit"
            disabled={importing}
            className="rounded-md bg-highlight px-4 py-2 text-sm font-medium text-[#01090C] disabled:opacity-50"
          >
            {importing ? "Đang import..." : "Import"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        {result && (
          <div className="mt-3 text-sm text-neutral-300">
            <p>
              Đã tạo mới <strong className="text-neutral-100">{result.created}</strong>, cập nhật{" "}
              <strong className="text-neutral-100">{result.updated}</strong> sách.
            </p>
            {result.errors.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-amber-400">
                {result.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
