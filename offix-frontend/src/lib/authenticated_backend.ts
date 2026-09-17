import "server-only"

import { cookies } from "next/headers"

import { get_api_base_url } from "@/lib/api"

export async function request_authenticated_backend(
  path: string,
  init?: RequestInit,
): Promise<Response | null> {
  const access_token = (await cookies()).get("access_token")?.value

  if (!access_token) return null

  const headers = new Headers(init?.headers)
  headers.set("Authorization", `Bearer ${access_token}`)

  return fetch(`${get_api_base_url()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  })
}
