import { notFound } from "next/navigation";
import { getBooks, getCategories } from "@/lib/db";
import BookForm from "@/components/admin/BookForm";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [books, categories] = await Promise.all([getBooks(), getCategories()]);
  const book = books.find((b) => b.id === id);

  if (!book) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold">Sửa sách</h1>
      <BookForm categories={categories} initialBook={book} />
    </div>
  );
}
