import { NextResponse } from "next/server";
import { getCategories, saveCategories } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { Category } from "@/lib/types";

export async function GET() {
  const categories = await getCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name) {
    return NextResponse.json({ error: "Tên category là bắt buộc." }, { status: 400 });
  }

  const categories = await getCategories();

  if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
    return NextResponse.json({ error: "Category đã tồn tại." }, { status: 409 });
  }

  const baseId = slugify(name) || "category";
  let id = baseId;
  let suffix = 2;
  while (categories.some((c) => c.id === id)) {
    id = `${baseId}-${suffix++}`;
  }

  const category: Category = { id, name };
  categories.push(category);
  await saveCategories(categories);

  return NextResponse.json({ category }, { status: 201 });
}
