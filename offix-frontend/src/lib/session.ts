import "server-only"

import { request_authenticated_backend } from "@/lib/authenticated_backend"

export type User_profile = {
  id_usuario: number
  email: string
  nombre: string | null
  rol: string
}

export function is_user_profile(value: unknown): value is User_profile {
  if (typeof value !== "object" || value === null) return false

  const profile = value as Record<string, unknown>
  return (
    typeof profile.id_usuario === "number" &&
    typeof profile.email === "string" &&
    (typeof profile.nombre === "string" || profile.nombre === null) &&
    typeof profile.rol === "string"
  )
}

export async function get_current_user(): Promise<User_profile | null> {
  try {
    const res = await request_authenticated_backend("/auth/me")
    if (res && res.ok) {
      const profile: unknown = await res.json()
      if (is_user_profile(profile)) return profile
    }
  } catch (error) {
    console.error("Error al obtener usuario:", error)
  }
  return null
}

export async function professional_has_valid_license(): Promise<boolean> {
  try {
    const matriculas_res = await request_authenticated_backend("/oferentes/me/matriculas")
    if (matriculas_res && matriculas_res.ok) {
      const matriculas: unknown = await matriculas_res.json()
      if (Array.isArray(matriculas) && matriculas.length > 0) {
        return true
      }
    }
  } catch (error) {
    console.error("Error al consultar matrículas existentes:", error)
  }
  return false
}
