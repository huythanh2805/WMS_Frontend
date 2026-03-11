"use server";

import { cookies } from "next/headers";

export async function saveRefreshToken(refreshToken: string) {
  const cookieStore = await cookies();

  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 ngày
  });
}