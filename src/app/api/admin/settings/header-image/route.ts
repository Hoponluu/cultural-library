import { NextResponse } from "next/server";
import { getSiteSettings, updateHeaderImage } from "@/lib/db";
import { deleteSiteAssetUpload, saveSiteAssetUpload } from "@/lib/upload";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Vui lòng chọn ảnh." }, { status: 400 });
  }

  let url: string;
  try {
    url = await saveSiteAssetUpload(file);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  const existing = await getSiteSettings();
  await updateHeaderImage(url);
  if (existing.headerImageUrl) await deleteSiteAssetUpload(existing.headerImageUrl);

  return NextResponse.json({ headerImageUrl: url });
}

export async function DELETE() {
  const existing = await getSiteSettings();
  await updateHeaderImage("");
  if (existing.headerImageUrl) await deleteSiteAssetUpload(existing.headerImageUrl);

  return NextResponse.json({ ok: true });
}
