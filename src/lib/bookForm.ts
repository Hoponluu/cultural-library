import "server-only";

export type ParsedBookFields = {
  title: string;
  author: string;
  publisher: string;
  description: string;
  link: string;
  categoryIds: string[];
  thumbnailFile: File | null;
  removeThumbnail: boolean;
};

export function parseBookFormData(formData: FormData): ParsedBookFields {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const publisher = String(formData.get("publisher") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const link = String(formData.get("link") ?? "").trim();
  const categoryIds = formData.getAll("categoryIds").map(String).filter(Boolean);

  const thumbnailEntry = formData.get("thumbnail");
  const thumbnailFile =
    thumbnailEntry instanceof File && thumbnailEntry.size > 0
      ? thumbnailEntry
      : null;

  const removeThumbnail = String(formData.get("removeThumbnail") ?? "") === "true";

  if (!title) throw new Error("Tên sách là bắt buộc.");

  return {
    title,
    author,
    publisher,
    description,
    link,
    categoryIds,
    thumbnailFile,
    removeThumbnail,
  };
}
