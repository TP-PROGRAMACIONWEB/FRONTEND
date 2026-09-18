"use client"

import {
  ArrowLeft01Icon,
  Certificate01Icon,
  CheckmarkBadge01Icon,
  Loading03Icon,
} from "hugeicons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { show_error_toast, show_info_toast, show_success_toast } from "@/components/ui/sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Profession_type = "Aire acondicionado" | "Gasista"

const DIGITS_BY_PROFESSION: Record<Profession_type, number> = {
  "Aire acondicionado": 8,
  Gasista: 10,
}

type Validation_response = {
  resultado: string
  mensaje: string
  matricula?: {
    id_matricula: number
    tipo_profesional: string
    numero_matricula: string
    categoria: string
    fecha_vencimiento: string
    fecha_fidelizacion: string
  } | null
}

export function License_validation_form() {
  const router = useRouter()
  const [tipo_profesional, set_tipo_profesional] = useState<Profession_type>("Aire acondicionado")
  const [numero_matricula, set_numero_matricula] = useState("")
  const [is_submitting, set_is_submitting] = useState(false)

  const expected_digits = DIGITS_BY_PROFESSION[tipo_profesional]
  const clean_number = numero_matricula.trim()
  const can_submit = clean_number.length > 0 && !is_submitting

  const handle_profession_change = (new_profession: Profession_type) => {
    set_tipo_profesional(new_profession)
  }

  const handle_number_change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw_val = e.target.value
    set_numero_matricula(raw_val)
  }

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!can_submit) return

    set_is_submitting(true)

    try {
      const response = await fetch("/api/matriculas/validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo_profesional,
          numero_matricula: clean_number,
        }),
      })

      const data = (await response.json().catch(() => null)) as Validation_response | { message?: string } | null

      if (!response.ok || !data) {
        const message =
          (data && "message" in data && typeof data.message === "string" && data.message) ||
          "No pudimos conectar con el servidor para validar la matrícula."
        show_error_toast(message)
        return
      }

      if ("resultado" in data) {
        const { resultado, mensaje } = data

        if (resultado === "Validada") {
          show_success_toast(mensaje || "Su matrícula fue fidelizada exitosamente")
          router.refresh()
          router.push("/")
        } else if (resultado === "Ya_Fidelizada") {
          show_info_toast(mensaje || "Su matrícula ya fue fidelizada")
          router.refresh()
          router.push("/")
        } else if (resultado === "Reemplazo_Solicitado") {
          show_info_toast(mensaje)
          router.refresh()
          router.push("/")
        } else {
          // No_Encontrada, Timeout, Vencida, Nombre_No_Coincide u otros fallos
          show_error_toast(mensaje)
        }
      } else {
        const message =
          ("message" in data && typeof data.message === "string" && data.message) ||
          "Ocurrió un error inesperado al validar la matrícula."
        show_error_toast(message)
      }
    } catch (error) {
      console.error("Error al enviar la validación de matrícula:", error)
      show_error_toast("No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.")
    } finally {
      set_is_submitting(false)
    }
  }

  return (
    <form
      aria-busy={is_submitting}
      className="space-y-6"
      onSubmit={handle_submit}
    >
      <div className="space-y-2">
        <Label
          className="font-heading text-sm font-semibold text-foreground"
          htmlFor="tipo-profesional"
        >
          Oficio o tipo de profesional
        </Label>
        <div className="relative">
          <select
            className="flex h-11 w-full appearance-none rounded-xl border border-input bg-card px-4 py-2 text-sm text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={is_submitting}
            id="tipo-profesional"
            onChange={(e) => handle_profession_change(e.target.value as Profession_type)}
            value={tipo_profesional}
          >
            <option value="Aire acondicionado">Aire acondicionado</option>
            <option value="Gasista">Gasista</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Seleccioná el rubro de tu matrícula según el padrón oficial.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            className="font-heading text-sm font-semibold text-foreground"
            htmlFor="numero-matricula"
          >
            Número de matrícula
          </Label>
        </div>
        <div className="relative">
          <Input
            aria-describedby="matricula-help"
            autoComplete="off"
            className="h-11 rounded-xl bg-card px-4 text-sm font-medium tracking-wide text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
            disabled={is_submitting}
            id="numero-matricula"
            onChange={handle_number_change}
            placeholder="Ej: 1000008919"
            type="text"
            value={numero_matricula}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground">
            <Certificate01Icon className="size-5" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground" id="matricula-help">
          Ingresá el número de matrícula sin guiones ni espacios.
        </p>
      </div>

      <div className="rounded-2xl bg-muted/60 p-4 text-xs leading-5 text-foreground/80">
        <div className="flex items-start gap-2.5">
          <CheckmarkBadge01Icon className="mt-0.5 size-4 shrink-0 text-foreground" />
          <p>
            Al validar tu matrícula, se verifica que coincida con el padrón oficial vigente y tu nombre registrado.
            Una vez confirmada, tu perfil lucirá la insignia de verificado.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <Button
          className="h-12 w-full rounded-xl font-heading text-sm font-semibold shadow-sm"
          disabled={!can_submit}
          type="submit"
        >
          {is_submitting ? (
            <>
              <Loading03Icon className="size-4 animate-spin" data-icon="inline-start" />
              Validando matrícula...
            </>
          ) : (
            <>
              <CheckmarkBadge01Icon className="size-4" data-icon="inline-start" />
              Confirmar validación
            </>
          )}
        </Button>

        <Link
          className={buttonVariants({
            variant: "ghost",
            className: "h-11 w-full text-foreground/70 hover:text-foreground",
          })}
          href="/"
        >
          <ArrowLeft01Icon className="size-4" data-icon="inline-start" />
          Volver al inicio
        </Link>
      </div>
    </form>
  )
}
