import { NextResponse } from "next/server"

import { request_authenticated_backend } from "@/lib/authenticated_backend"

type Moderate_review_route_props = {
  params: Promise<{ review_id: string }>
}

function is_moderation_input(value: unknown): value is { aceptar: boolean } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).aceptar === "boolean"
  )
}

export async function PATCH(request: Request, { params }: Moderate_review_route_props) {
  const { review_id } = await params
  const parsed_review_id = Number(review_id)

  if (!Number.isInteger(parsed_review_id) || parsed_review_id < 1) {
    return NextResponse.json({ message: "La reseña no es válida." }, { status: 400 })
  }

  let input: unknown

  try {
    input = await request.json()
  } catch {
    return NextResponse.json({ message: "La decisión no es válida." }, { status: 400 })
  }

  if (!is_moderation_input(input)) {
    return NextResponse.json({ message: "La decisión no es válida." }, { status: 400 })
  }

  try {
    const response = await request_authenticated_backend(
      `/resenas/${parsed_review_id}/moderar`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    )

    if (!response) {
      return NextResponse.json({ message: "La sesión no está disponible." }, { status: 401 })
    }

    if (!response.ok) {
      const messages: Record<number, string> = {
        400: "La reseña ya había sido resuelta.",
        401: "La sesión venció. Volvé a iniciar sesión.",
        403: "No tenés permiso para resolver esta reseña.",
        404: "La reseña ya no está disponible.",
      }

      return NextResponse.json(
        { message: messages[response.status] ?? "No pudimos resolver la reseña." },
        { status: response.status },
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("No se pudo moderar la reseña.", error)
    return NextResponse.json(
      { message: "No pudimos conectarnos con el servidor." },
      { status: 502 },
    )
  }
}
