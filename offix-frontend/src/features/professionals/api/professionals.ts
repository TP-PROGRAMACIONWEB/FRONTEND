import type {
  Professional,
  Professional_api_result,
  Professional_category,
} from "@/features/professionals/types/professional"
import { get_api_base_url } from "@/lib/api"

function is_record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function is_nullable_string(value: unknown): value is string | null {
  return typeof value === "string" || value === null
}

function is_decimal(value: unknown): value is string | number | null {
  return value === null || typeof value === "string" || typeof value === "number"
}

function is_professional(value: unknown): value is Professional {
  if (!is_record(value)) return false

  return (
    typeof value.id_oferente === "number" &&
    typeof value.nombre === "string" &&
    typeof value.apellido === "string" &&
    typeof value.telefono === "string" &&
    (typeof value.categoria_id === "number" || value.categoria_id === null) &&
    is_nullable_string(value.numero_matricula) &&
    is_decimal(value.radio_cobertura_km) &&
    is_nullable_string(value.hora_inicio_atencion) &&
    is_nullable_string(value.hora_fin_atencion) &&
    typeof value.disponible_emergencia === "boolean" &&
    is_nullable_string(value.descripcion) &&
    typeof value.estado_verificacion === "string" &&
    is_decimal(value.promedio_calificacion) &&
    value.promedio_calificacion !== null &&
    typeof value.tiene_matricula_validada === "boolean"
  )
}

function is_category(value: unknown): value is Professional_category {
  return (
    is_record(value) &&
    typeof value.id_categoria === "number" &&
    typeof value.nombre === "string"
  )
}

async function request_json(path: string): Promise<{ body: unknown; status: number }> {
  const response = await fetch(`${get_api_base_url()}${path}`, { cache: "no-store" })
  let body: unknown = null

  try {
    body = await response.json()
  } catch {
    // La validación posterior convierte una respuesta vacía o inválida en error controlado.
  }

  return { body, status: response.status }
}

export async function get_professionals(): Promise<Professional_api_result<Professional[]>> {
  try {
    const { body, status } = await request_json("/oferentes")

    if (status !== 200 || !Array.isArray(body) || !body.every(is_professional)) {
      return { ok: false, status, message: "No pudimos cargar los profesionales." }
    }

    return { data: body, ok: true }
  } catch (error) {
    console.error("No se pudieron consultar los profesionales.", error)
    return { ok: false, status: 0, message: "No pudimos conectarnos con el servidor." }
  }
}

export async function get_professional(id: number): Promise<Professional_api_result<Professional>> {
  try {
    const { body, status } = await request_json(`/oferentes/${id}`)

    if (status === 404) {
      return { ok: false, status, message: "El perfil profesional no existe." }
    }

    if (status !== 200 || !is_professional(body)) {
      return { ok: false, status, message: "No pudimos cargar el perfil profesional." }
    }

    return { data: body, ok: true }
  } catch (error) {
    console.error("No se pudo consultar el perfil profesional.", error)
    return { ok: false, status: 0, message: "No pudimos conectarnos con el servidor." }
  }
}

export async function get_professional_categories(): Promise<
  Professional_api_result<Professional_category[]>
> {
  try {
    const { body, status } = await request_json("/categorias")

    if (status !== 200 || !Array.isArray(body) || !body.every(is_category)) {
      return { ok: false, status, message: "No pudimos cargar las categorías." }
    }

    return { data: body, ok: true }
  } catch (error) {
    console.error("No se pudieron consultar las categorías.", error)
    return { ok: false, status: 0, message: "No pudimos conectarnos con el servidor." }
  }
}
