import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createBook, getBooks } from "@/lib/db";
import { parseBookFormData } from "@/lib/bookForm";
import { saveThumbnailUpload } from "@/lib/upload";
import type { Book } from "@/lib/types";

export async function GET() {
  const books = await getBooks();
  return NextResponse.json({ books });
}

export async function POST(request: Request) {
  const formData = await request.formData();

  let fields;
  try {
    fields = parseBookFormData(formData);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }

  let thumbnail = "";
  if (fields.thumbnailFile) {
    try {
      thumbnail = await saveThumbnailUpload(fields.thumbnailFile);
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
  }

  const book: Book = {
    id: randomUUID(),
    title: fields.title,
    author: fields.author,
    publisher: fields.publisher,
    thumbnail,
    description: fields.description,
    link: fields.link,
    categoryIds: fields.categoryIds,
    createdAt: new Date().toISOString(),
  };

  await createBook(book);

  return NextResponse.json({ book }, { status: 201 });
}
