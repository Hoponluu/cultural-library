"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/ChatVietCMS/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-red-600 hover:underline dark:text-red-400"
    >
      Đăng xuất
    </button>
  );
}
