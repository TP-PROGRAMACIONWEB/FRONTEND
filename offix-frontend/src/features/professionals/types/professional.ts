export type Professional = {
  id_oferente: number
  nombre: string
  apellido: string
  telefono: string
  categoria_id: number | null
  numero_matricula: string | null
  radio_cobertura_km: string | number | null
  hora_inicio_atencion: string | null
  hora_fin_atencion: string | null
  disponible_emergencia: boolean
  descripcion: string | null
  estado_verificacion: string
  promedio_calificacion: string | number
  tiene_matricula_validada: boolean
}

export type Professional_category = {
  id_categoria: number
  nombre: string
}

export type Professional_api_result<T> =
  | { data: T; ok: true }
  | { message: string; ok: false; status: number }
