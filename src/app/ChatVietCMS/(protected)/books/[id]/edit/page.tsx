import { notFound } from "next/navigation";
import { getBookById, getCategories } from "@/lib/db";
import BookForm from "@/components/admin/BookForm";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [book, categories] = await Promise.all([getBookById(id), getCategories()]);

  if (!book) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-highlight">Sửa sách</h1>
      <BookForm categories={categories} initialBook={book} />
    </div>
  );
}
