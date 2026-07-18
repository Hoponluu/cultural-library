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
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/ChatVietCMS" className="text-lg font-semibold text-highlight">
            Admin
          </Link>
          <nav className="flex gap-4 text-sm text-neutral-300">
            <Link href="/ChatVietCMS/books" className="hover:text-highlight hover:underline">
              Sách
            </Link>
            <Link href="/ChatVietCMS/categories" className="hover:text-highlight hover:underline">
              Category
            </Link>
            <Link href="/ChatVietCMS/import-export" className="hover:text-highlight hover:underline">
              Import / Export
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-neutral-300 hover:text-highlight hover:underline">
            Xem trang public
          </Link>
          <LogoutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
