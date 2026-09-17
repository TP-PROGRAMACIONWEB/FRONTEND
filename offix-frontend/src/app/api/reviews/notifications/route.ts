import { NextResponse } from "next/server"

import { request_authenticated_backend } from "@/lib/authenticated_backend"

export async function GET() {
  try {
    const response = await request_authenticated_backend("/notificaciones")

    if (!response) {
      return NextResponse.json({ message: "La sesión no está disponible." }, { status: 401 })
    }

    if (!response.ok) {
      return NextResponse.json(
        { message: "No pudimos consultar las notificaciones." },
        { status: response.status },
      )
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    console.error("No se pudieron consultar las notificaciones.", error)
    return NextResponse.json(
      { message: "No pudimos conectarnos con el servidor." },
      { status: 502 },
    )
  }
}
