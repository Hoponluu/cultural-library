import { getCategories } from "@/lib/db";
import BookForm from "@/components/admin/BookForm";

export default async function NewBookPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-2xl font-semibold text-highlight">Thêm sách mới</h1>
      <BookForm categories={categories} />
    </div>
  );
}
