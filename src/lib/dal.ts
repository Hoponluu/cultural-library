import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "./auth";

export const isAdminSession = cache(async (): Promise<boolean> => {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
});

export async function requireAdminSession(): Promise<void> {
  const ok = await isAdminSession();
  if (!ok) redirect("/admin/login");
}
