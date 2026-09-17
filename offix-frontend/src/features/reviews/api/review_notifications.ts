import type {
  Review_api_result,
  Review_notification,
} from "@/features/reviews/types/review"

function is_record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function is_nullable_string(value: unknown): value is string | null {
  return typeof value === "string" || value === null
}

export function is_review_notification(value: unknown): value is Review_notification {
  if (!is_record(value)) return false

  return (
    typeof value.id_notificacion === "number" &&
    typeof value.tipo === "string" &&
    typeof value.mensaje === "string" &&
    typeof value.requiere_accion === "boolean" &&
    typeof value.estado === "string" &&
    (typeof value.resena_id === "number" || value.resena_id === null) &&
    is_nullable_string(value.nombre_cliente) &&
    is_nullable_string(value.telefono_cliente) &&
    is_nullable_string(value.email_cliente) &&
    typeof value.fecha_creacion === "string" &&
    is_nullable_string(value.fecha_resolucion)
  )
}

async function read_json(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function get_review_notifications(): Promise<
  Review_api_result<Review_notification[]>
> {
  try {
    const response = await fetch("/api/reviews/notifications", { cache: "no-store" })
    const body = await read_json(response)

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message:
          response.status === 401
            ? "La sesión venció. Volvé a iniciar sesión."
            : "No pudimos cargar las notificaciones.",
      }
    }

    if (!Array.isArray(body) || !body.every(is_review_notification)) {
      return {
        ok: false,
        status: 502,
        message: "El servidor devolvió notificaciones que no pudimos interpretar.",
      }
    }

    return { data: body, ok: true }
  } catch (error) {
    console.error("No se pudieron cargar las notificaciones.", error)
    return {
      ok: false,
      status: 0,
      message: "No pudimos conectarnos con el servidor.",
    }
  }
}

export async function moderate_review(
  review_id: number,
  accept: boolean,
): Promise<Review_api_result<true>> {
  try {
    const response = await fetch(`/api/reviews/${review_id}/moderate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ aceptar: accept }),
    })
    const body = await read_json(response)

    if (!response.ok) {
      const message =
        is_record(body) && typeof body.message === "string"
          ? body.message
          : "No pudimos resolver la reseña."

      return { ok: false, status: response.status, message }
    }

    return { data: true, ok: true }
  } catch (error) {
    console.error("No se pudo resolver la reseña.", error)
    return {
      ok: false,
      status: 0,
      message: "No pudimos conectarnos con el servidor.",
    }
  }
}
