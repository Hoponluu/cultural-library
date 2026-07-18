"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function HeaderImageUploader({
  initialUrl,
}: {
  initialUrl: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(initialUrl);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setSaving(true);
    setError(null);

    const formData = new FormData();
    formData.set("file", file);

    const res = await fetch("/api/admin/settings/header-image", {
      method: "POST",
      body: formData,
    });
    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Upload thất bại.");
      return;
    }

    const data = await res.json();
    setPreview(data.headerImageUrl);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  async function handleRemove() {
    if (!confirm("Xoá ảnh header hiện tại? Trang public sẽ quay về khung placeholder.")) return;

    setSaving(true);
    setError(null);

    const res = await fetch("/api/admin/settings/header-image", { method: "DELETE" });
    setSaving(false);

    if (!res.ok) {
      setError("Xoá thất bại.");
      return;
    }

    setPreview("");
    router.refresh();
  }

  return (
    <div className="max-w-xl">
      <div className="mb-4 aspect-[3/1] w-full overflow-hidden rounded-lg border border-neutral-800 bg-white/5">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Ảnh header" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
            Chưa có ảnh header
          </div>
        )}
      </div>

      <form onSubmit={handleUpload} className="flex flex-wrap items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-neutral-300"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-highlight px-4 py-2 text-sm font-medium text-[#01090C] disabled:opacity-50"
        >
          {saving ? "Đang lưu..." : "Tải lên & thay ảnh"}
        </button>
        {initialUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={saving}
            className="text-sm text-red-400 hover:underline disabled:opacity-50"
          >
            Xoá ảnh hiện tại
          </button>
        )}
      </form>

      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

      <p className="mt-4 text-sm text-neutral-500">
        Ảnh này hiển thị ở khung cố định trên cùng trang public (nền cho tiêu đề, tỉ lệ khuyến
        nghị khoảng 3:1, ví dụ 1600×530px). Upload ảnh mới sẽ tự thay thế và xoá ảnh cũ.
      </p>
    </div>
  );
}
