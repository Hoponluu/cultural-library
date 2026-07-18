import { NextResponse } from "next/server";
import { deleteCategory, getCategories } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const categories = await getCategories();
  if (!categories.some((c) => c.id === id)) {
    return NextResponse.json({ error: "Không tìm thấy category." }, { status: 404 });
  }

  await deleteCategory(id);

  return NextResponse.json({ ok: true });
}
