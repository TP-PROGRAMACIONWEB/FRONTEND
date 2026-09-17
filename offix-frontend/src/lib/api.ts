export function get_api_base_url() {
  const api_base_url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")

  if (!api_base_url) {
    throw new Error("NEXT_PUBLIC_API_URL no está configurada.")
  }

  return api_base_url
}
