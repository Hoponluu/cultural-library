import "server-only";
import { randomUUID } from "crypto";
import { COVERS_BUCKET, getSupabase } from "./supabase";

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

  const { error } = await getSupabase()
    .storage.from(COVERS_BUCKET)
    .upload(filename, file, { contentType: file.type });
  if (error) throw new Error(error.message);

  const { data } = getSupabase().storage.from(COVERS_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

export async function deleteThumbnailUpload(publicUrl: string): Promise<void> {
  const marker = `/${COVERS_BUCKET}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return;

  const filename = publicUrl.slice(index + marker.length);
  if (!filename) return;

  await getSupabase().storage.from(COVERS_BUCKET).remove([filename]);
}
