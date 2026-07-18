import { getBooks, getCategories, getSiteSettings } from "@/lib/db";
import BookGrid from "@/components/BookGrid";
import HeroHeader, { HERO_HEIGHT_CLASS } from "@/components/HeroHeader";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [books, categories, settings] = await Promise.all([
    getBooks(),
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <>
      <HeroHeader imageUrl={settings.headerImageUrl} />
      {/* Spacer giữ chỗ cho hero, đẩy nội dung xuống dưới nó lúc đầu trang */}
      <div className={HERO_HEIGHT_CLASS} />
      <main className="relative z-10 rounded-t-2xl bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-highlight sm:text-3xl">
              Thư viện sách khảo cứu văn hoá
            </h1>
            <p className="mt-2 text-neutral-400">
              Tuyển tập các đầu sách khảo cứu văn hoá Việt Nam và thế giới.
            </p>
          </header>
          <BookGrid books={books} categories={categories} />
        </div>
        <footer className="border-t border-neutral-800 py-6">
          <p className="mx-auto w-full max-w-6xl px-4 text-sm text-neutral-500">
            Một dự án phụ của{" "}
            <a
              href="https://chatviet.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-highlight hover:underline"
            >
              Chất Việt
            </a>
            , nhằm lưu trữ tư liệu nghiên cứu.
          </p>
        </footer>
      </main>
    </>
  );
}
