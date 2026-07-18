import { NextResponse } from "next/server";
import { getBooks, getCategories, saveBooks, saveCategories } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const categories = await getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Không tìm thấy category." }, { status: 404 });
  }
  categories.splice(index, 1);
  await saveCategories(categories);

  const books = await getBooks();
  let changed = false;
  for (const book of books) {
    if (book.categoryIds.includes(id)) {
      book.categoryIds = book.categoryIds.filter((c) => c !== id);
      changed = true;
    }
  }
  if (changed) await saveBooks(books);

  return NextResponse.json({ ok: true });
}
