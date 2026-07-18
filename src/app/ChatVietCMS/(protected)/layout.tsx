import Link from "next/link";
import { requireAdminSession } from "@/lib/dal";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/ChatVietCMS" className="text-lg font-semibold">
            Admin
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/ChatVietCMS/books" className="hover:underline">
              Sách
            </Link>
            <Link href="/ChatVietCMS/categories" className="hover:underline">
              Category
            </Link>
            <Link href="/ChatVietCMS/import-export" className="hover:underline">
              Import / Export
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm hover:underline">
            Xem trang public
          </Link>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
