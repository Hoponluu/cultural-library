import { getBooks, getCategories } from "@/lib/db";
import BookGrid from "@/components/BookGrid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [books, categories] = await Promise.all([getBooks(), getCategories()]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          Thư viện sách khảo cứu văn hoá
        </h1>
        <p className="mt-2 text-black/60 dark:text-white/60">
          Tuyển tập các đầu sách khảo cứu văn hoá Việt Nam và thế giới.
        </p>
      </header>
      <BookGrid books={books} categories={categories} />
    </main>
  );
}
