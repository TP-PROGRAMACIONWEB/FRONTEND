import type {
  Review_api_result,
  Review_invitation,
  Review_invitation_input,
  Review_request,
  Review_submission,
  Submitted_review,
} from "@/features/reviews/types/review"
import { get_api_base_url } from "@/lib/api"

function is_record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function is_nullable_string(value: unknown): value is string | null {
  return typeof value === "string" || value === null
}

function is_http_url(value: unknown): value is string {
  if (typeof value !== "string") return false

  try {
    const protocol = new URL(value).protocol
    return protocol === "http:" || protocol === "https:"
  } catch {
    return false
  }
}

function is_review_invitation(value: unknown): value is Review_invitation {
  if (!is_record(value)) return false

  return (
    typeof value.id_solicitud === "number" &&
    typeof value.oferente_id === "number" &&
    typeof value.codigo_unico === "string" &&
    typeof value.origen === "string" &&
    typeof value.nombre_cliente === "string" &&
    is_nullable_string(value.telefono_cliente) &&
    is_nullable_string(value.email_cliente) &&
    typeof value.estado === "string" &&
    typeof value.fecha_generacion === "string" &&
    typeof value.fecha_expiracion === "string" &&
    is_http_url(value.url_resena) &&
    (value.whatsapp_url === null || is_http_url(value.whatsapp_url)) &&
    typeof value.email_enviado === "boolean"
  )
}

function is_review_request(value: unknown): value is Review_request {
  if (!is_record(value)) return false

  return (
    typeof value.codigo_unico === "string" &&
    typeof value.oferente_id === "number" &&
    typeof value.nombre_oferente === "string" &&
    typeof value.nombre_cliente === "string" &&
    is_nullable_string(value.telefono_cliente) &&
    is_nullable_string(value.email_cliente) &&
    typeof value.estado === "string" &&
    typeof value.vencida === "boolean" &&
    typeof value.utilizable === "boolean" &&
    typeof value.fecha_generacion === "string" &&
    typeof value.fecha_expiracion === "string"
  )
}

function is_submitted_review(value: unknown): value is Submitted_review {
  if (!is_record(value)) return false

  return (
    typeof value.id_resena === "number" &&
    typeof value.oferente_id === "number" &&
    typeof value.solicitud_id === "number" &&
    typeof value.nombre_cliente === "string" &&
    is_record(value.calificaciones_comentarios) &&
    typeof value.estado === "string" &&
    typeof value.fecha_creacion === "string"
  )
}

async function read_json(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

export async function create_review_invitation(
  oferente_id: number,
  input: Review_invitation_input,
): Promise<Review_api_result<Review_invitation>> {
  try {
    const response = await fetch(
      `${get_api_base_url()}/oferentes/${oferente_id}/solicitudes-resena`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    )
    const body = await read_json(response)

    if (!response.ok) {
      const messages: Record<number, string> = {
        404: "Tu cuenta todavía no tiene un perfil de oferente.",
        422: "Revisá el nombre y los datos de contacto ingresados.",
        502: "No se pudo enviar el correo. Intentá nuevamente más tarde.",
      }

      return {
        ok: false,
        status: response.status,
        message: messages[response.status] ?? "No pudimos generar el enlace.",
      }
    }

    if (!is_review_invitation(body)) {
      return {
        ok: false,
        status: 502,
        message: "El servidor devolvió una respuesta que no pudimos interpretar.",
      }
    }

    return { data: body, ok: true }
  } catch (error) {
    console.error("No se pudo generar la solicitud de reseña.", error)
    return {
      ok: false,
      status: 0,
      message: "No pudimos conectarnos con el servidor. Intentá nuevamente más tarde.",
    }
  }
}

export async function get_review_request(
  code: string,
): Promise<Review_api_result<Review_request>> {
  try {
    const response = await fetch(
      `${get_api_base_url()}/solicitudes-resena/${encodeURIComponent(code)}`,
      { cache: "no-store" },
    )
    const body = await read_json(response)

    if (response.status === 404) {
      return {
        ok: false,
        status: response.status,
        message: "El enlace de reseña no existe o dejó de estar disponible.",
      }
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "No pudimos consultar el enlace. Intentá nuevamente más tarde.",
      }
    }

    if (!is_review_request(body)) {
      return {
        ok: false,
        status: 502,
        message: "El servidor devolvió una respuesta que no pudimos interpretar.",
      }
    }

    return { data: body, ok: true }
  } catch (error) {
    console.error("No se pudo consultar la solicitud de reseña.", error)
    return {
      ok: false,
      status: 0,
      message: "No pudimos conectarnos con el servidor. Intentá nuevamente más tarde.",
    }
  }
}

export async function create_review(
  submission: Review_submission,
): Promise<Review_api_result<Submitted_review>> {
  try {
    const response = await fetch(`${get_api_base_url()}/resenas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
      cache: "no-store",
    })
    const body = await read_json(response)

    if (!response.ok) {
      const message =
        response.status === 400 || response.status === 404 || response.status === 409
          ? "Este enlace ya fue utilizado o dejó de estar disponible."
          : "No pudimos guardar la reseña. Revisá los datos e intentá nuevamente."

      return { ok: false, status: response.status, message }
    }

    if (!is_submitted_review(body)) {
      return {
        ok: false,
        status: 502,
        message: "El servidor no confirmó correctamente la reseña.",
      }
    }

    return { data: body, ok: true }
  } catch (error) {
    console.error("No se pudo enviar la reseña.", error)
    return {
      ok: false,
      status: 0,
      message: "No pudimos conectarnos con el servidor. Intentá nuevamente más tarde.",
    }
  }
}
