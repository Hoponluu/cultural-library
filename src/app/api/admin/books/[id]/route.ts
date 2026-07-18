import { NextResponse } from "next/server";
import { getBooks, saveBooks } from "@/lib/db";
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

  const books = await getBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Không tìm thấy sách." }, { status: 404 });
  }

  const existing = books[index];
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

  books[index] = {
    ...existing,
    title: fields.title,
    author: fields.author,
    publisher: fields.publisher,
    description: fields.description,
    link: fields.link,
    categoryIds: fields.categoryIds,
    thumbnail,
  };

  await saveBooks(books);

  return NextResponse.json({ book: books[index] });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const books = await getBooks();
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Không tìm thấy sách." }, { status: 404 });
  }

  const [removed] = books.splice(index, 1);
  await saveBooks(books);
  if (removed.thumbnail) await deleteThumbnailUpload(removed.thumbnail);

  return NextResponse.json({ ok: true });
}
