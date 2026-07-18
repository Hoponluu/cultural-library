import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function saveThumbnailUpload(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Định dạng ảnh không được hỗ trợ.");
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${randomUUID()}.${ext}`;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/${filename}`;
}

export async function deleteThumbnailUpload(publicPath: string): Promise<void> {
  if (!publicPath.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", publicPath);
  await fs.unlink(filePath).catch(() => {});
}
