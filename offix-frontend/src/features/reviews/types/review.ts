export const rating_keys = [
  "punctuality",
  "price",
  "quality",
  "attention",
] as const

export type Rating_key = (typeof rating_keys)[number]

export type Rating_values = Record<Rating_key, number>

export type Rating_category = {
  description: string
  key: Rating_key
  label: string
}

export type Review_request = {
  codigo_unico: string
  oferente_id: number
  nombre_oferente: string
  nombre_cliente: string
  telefono_cliente: string | null
  email_cliente: string | null
  estado: string
  vencida: boolean
  utilizable: boolean
  fecha_generacion: string
  fecha_expiracion: string
}

export type Review_submission = {
  codigo_unico: string
  calificaciones_comentarios: {
    criterios: {
      precio: number
      calidad: number
      atencion: number
      puntualidad: number
    }
    comentario: string | null
  }
}

export type Review_invitation_input = {
  nombre_cliente: string
  telefono_cliente: string | null
  email_cliente: string | null
}

export type Review_invitation = Review_invitation_input & {
  id_solicitud: number
  oferente_id: number
  codigo_unico: string
  origen: string
  estado: string
  fecha_generacion: string
  fecha_expiracion: string
  url_resena: string
  whatsapp_url: string | null
  email_enviado: boolean
}

export type Submitted_review = {
  id_resena: number
  oferente_id: number
  solicitud_id: number
  nombre_cliente: string
  calificaciones_comentarios: {
    puntuacion_global: number
    criterios: {
      precio: number
      calidad: number
      atencion: number
      puntualidad: number
    }
    comentario: string | null
  }
  estado: string
  fecha_creacion: string
}

export type Review_api_result<T> =
  | { data: T; ok: true }
  | { message: string; ok: false; status: number }
