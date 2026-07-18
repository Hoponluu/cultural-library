import { NextResponse } from "next/server";
import { deleteBook, getBookById, updateBook } from "@/lib/db";
import { parseBookFormData } from "@/lib/bookForm";
import { deleteThumbnailUpload, saveThumbnailUpload } from "@/lib/upload";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await request.formData();

  let fields;
  try {
    fields = parseBookFormData(formData);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  const existing = await getBookById(id);
  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy sách." }, { status: 404 });
  }

  let thumbnail = existing.thumbnail;

  if (fields.thumbnailFile) {
    try {
      const newThumbnail = await saveThumbnailUpload(fields.thumbnailFile);
      if (existing.thumbnail) await deleteThumbnailUpload(existing.thumbnail);
      thumbnail = newThumbnail;
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
  } else if (fields.removeThumbnail) {
    if (existing.thumbnail) await deleteThumbnailUpload(existing.thumbnail);
    thumbnail = "";
  }

  const updated = {
    title: fields.title,
    author: fields.author,
    publisher: fields.publisher,
    description: fields.description,
    link: fields.link,
    categoryIds: fields.categoryIds,
    thumbnail,
  };

  await updateBook(id, updated);

  return NextResponse.json({ book: { id, createdAt: existing.createdAt, ...updated } });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const existing = await getBookById(id);
  if (!existing) {
    return NextResponse.json({ error: "Không tìm thấy sách." }, { status: 404 });
  }

  await deleteBook(id);
  if (existing.thumbnail) await deleteThumbnailUpload(existing.thumbnail);

  return NextResponse.json({ ok: true });
}
