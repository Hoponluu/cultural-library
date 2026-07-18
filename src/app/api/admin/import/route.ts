import { NextResponse } from "next/server";
import { getBooks, getCategories, saveBooks, saveCategories } from "@/lib/db";
import { parseBooksCsv } from "@/lib/csv";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Vui lòng chọn file CSV." }, { status: 400 });
  }

  const csvText = await file.text();
  const [existingBooks, existingCategories] = await Promise.all([
    getBooks(),
    getCategories(),
  ]);

  const result = parseBooksCsv(csvText, existingBooks, existingCategories);

  await saveCategories(result.categories);
  await saveBooks(result.books);

  return NextResponse.json({
    created: result.created,
    updated: result.updated,
    errors: result.errors,
  });
}
