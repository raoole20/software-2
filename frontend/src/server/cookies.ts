"use server";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export async function setCookie(
  name: string,
  value: string,
  options: Partial<ResponseCookie> = {}
) {
  const cookieStore = await cookies();
  cookieStore.set({
    name,
    value,
    ...options,
  });
}
