import { NextResponse } from "next/server"

import { request_authenticated_backend } from "@/lib/authenticated_backend"

type License_validation_input = {
  tipo_profesional: "Gasista" | "Aire acondicionado"
  numero_matricula: string
}

function is_license_validation_input(value: unknown): value is License_validation_input {
  if (typeof value !== "object" || value === null) return false

  const record = value as Record<string, unknown>
  const tipo = record.tipo_profesional
  const numero = record.numero_matricula

  const valid_types = tipo === "Gasista" || tipo === "Aire acondicionado"
  const valid_number = typeof numero === "string" && numero.trim().length > 0

  return valid_types && valid_number
}

export async function POST(request: Request) {
  let input: unknown

  try {
    input = await request.json()
  } catch {
    return NextResponse.json(
      { message: "Los datos de validación no son válidos." },
      { status: 400 },
    )
  }

  if (!is_license_validation_input(input)) {
    return NextResponse.json(
      { message: "Verificá el oficio y que el número de matrícula no esté vacío." },
      { status: 422 },
    )
  }

  const tipo_profesional = input.tipo_profesional
  const numero_matricula = input.numero_matricula.trim()

  // Removed length check

  try {
    const response = await request_authenticated_backend(
      "/oferentes/me/matriculas/validaciones",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_profesional,
          numero_matricula,
        }),
      },
    )

    if (!response) {
      return NextResponse.json(
        { message: "La sesión no está disponible. Iniciá sesión nuevamente." },
        { status: 401 },
      )
    }

    const data: unknown = await response.json().catch(() => null)

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { message: "El usuario autenticado no tiene un perfil de profesional (oferente)." },
          { status: 404 },
        )
      }

      if (response.status === 422) {
        return NextResponse.json(
          { message: "Los datos ingresados no cumplen con el formato requerido." },
          { status: 422 },
        )
      }

      return NextResponse.json(
        { message: "No pudimos procesar la validación en el servidor." },
        { status: response.status },
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("No se pudo validar la matrícula profesional.", error)
    return NextResponse.json(
      { message: "No pudimos conectarnos con el servidor." },
      { status: 502 },
    )
  }
}
