import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  createSessionToken,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD chưa được cấu hình trên server." },
      { status: 500 }
    );
  }

  if (!password || !verifyPassword(password)) {
    return NextResponse.json({ error: "Mật khẩu không đúng." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), SESSION_COOKIE_OPTIONS);

  return NextResponse.json({ ok: true });
}
