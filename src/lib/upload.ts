import "server-only";
import { randomUUID } from "crypto";
import { COVERS_BUCKET, SITE_ASSETS_BUCKET, getSupabase } from "./supabase";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

async function saveImageUpload(bucket: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Định dạng ảnh không được hỗ trợ.");
  }

  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `${randomUUID()}.${ext}`;

  const { error } = await getSupabase()
    .storage.from(bucket)
    .upload(filename, file, { contentType: file.type });
  if (error) throw new Error(error.message);

  const { data } = getSupabase().storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}

async function deleteImageUpload(bucket: string, publicUrl: string): Promise<void> {
  const marker = `/${bucket}/`;
  const index = publicUrl.indexOf(marker);
  if (index === -1) return;

  const filename = publicUrl.slice(index + marker.length);
  if (!filename) return;

  await getSupabase().storage.from(bucket).remove([filename]);
}

export function saveThumbnailUpload(file: File): Promise<string> {
  return saveImageUpload(COVERS_BUCKET, file);
}

export function deleteThumbnailUpload(publicUrl: string): Promise<void> {
  return deleteImageUpload(COVERS_BUCKET, publicUrl);
}

export function saveSiteAssetUpload(file: File): Promise<string> {
  return saveImageUpload(SITE_ASSETS_BUCKET, file);
}

export function deleteSiteAssetUpload(publicUrl: string): Promise<void> {
  return deleteImageUpload(SITE_ASSETS_BUCKET, publicUrl);
}
