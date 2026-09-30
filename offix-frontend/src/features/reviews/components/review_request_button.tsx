"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import {
  Cancel01Icon,
  Link04Icon,
  Loading03Icon,
  StarIcon,
} from "hugeicons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { show_error_toast, show_success_toast } from "@/components/ui/sonner"
import { create_review_invitation } from "@/features/reviews/api/reviews"

type Review_request_button_props = {
  can_send_whatsapp: boolean
  oferente_id: number
  trigger_class_name?: string
}

type Field_name = "name" | "phone" | "email"
type Field_errors = Partial<Record<Field_name, string>>

const phone_pattern = /^(?!15)(?:[1-9]\d{2}-?\d{7}|[1-9]\d{3}-?\d{6})$/
const email_pattern = /^[^\s@]+@[^\s@]+\.com$/

function is_valid_phone(phone: string): boolean {
  return phone_pattern.test(phone)
}

function is_valid_email(email: string): boolean {
  return email_pattern.test(email)
}

export function Review_request_button({
  can_send_whatsapp,
  oferente_id,
  trigger_class_name,
}: Review_request_button_props) {
  const [email, set_email] = useState("")
  const [field_errors, set_field_errors] = useState<Field_errors>({})
  const [is_open, set_is_open] = useState(false)
  const [is_submitting, set_is_submitting] = useState(false)
  const [name, set_name] = useState("")
  const [phone, set_phone] = useState("")

  useEffect(() => {
    if (!is_open) return

    function handle_key_down(event: KeyboardEvent) {
      if (event.key === "Escape" && !is_submitting) {
        reset_and_close_modal()
      }
    }

    document.addEventListener("keydown", handle_key_down)
    return () => document.removeEventListener("keydown", handle_key_down)
  }, [is_open, is_submitting])

  function reset_and_close_modal() {
    set_email("")
    set_field_errors({})
    set_is_open(false)
    set_name("")
    set_phone("")
  }

  function open_modal() {
    set_is_open(true)
  }

  function handle_name_change(event: ChangeEvent<HTMLInputElement>) {
    set_name(event.target.value)
    set_field_errors((current) => ({ ...current, name: undefined }))
  }

  function handle_phone_change(event: ChangeEvent<HTMLInputElement>) {
    const sanitized_phone = event.target.value.replace(/[^\d-]/g, "")
    const digit_count = sanitized_phone.replace(/\D/g, "").length

    set_phone(sanitized_phone)
    set_field_errors((current) => ({
      ...current,
      phone: digit_count > 10 ? "Formato incorrecto" : undefined,
    }))
  }

  function handle_email_change(event: ChangeEvent<HTMLInputElement>) {
    const next_email = event.target.value

    set_email(next_email)
    set_field_errors((current) => ({
      ...current,
      email: next_email && !is_valid_email(next_email) ? "Formato incorrecto" : undefined,
    }))
  }

  async function handle_submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmed_name = name.trim()
    const trimmed_phone = phone.trim()
    const trimmed_email = email.trim()
    const errors: Field_errors = {}

    if (!trimmed_name) {
      errors.name = "Ingresá el nombre del cliente."
    } else if (trimmed_name.length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres."
    } else if (trimmed_name.length > 100) {
      errors.name = "El nombre no puede superar los 100 caracteres."
    }

    if (trimmed_phone && !is_valid_phone(trimmed_phone)) {
      errors.phone = "Formato incorrecto"
    }

    if (trimmed_email && !is_valid_email(trimmed_email)) {
      errors.email = "Formato incorrecto"
    }

    if (!trimmed_phone && !trimmed_email) {
      set_field_errors(errors)
      show_error_toast("Debe completar al menos un dato de contacto para poder generar el enlace.")
      return
    }

    if (Object.keys(errors).length > 0) {
      set_field_errors(errors)
      return
    }

    const whatsapp_window = can_send_whatsapp && trimmed_phone ? window.open("", "_blank") : null

    set_field_errors({})
    set_is_submitting(true)
    const result = await create_review_invitation(oferente_id, {
      nombre_cliente: trimmed_name,
      telefono_cliente: trimmed_phone || null,
      email_cliente: trimmed_email || null,
    })
    set_is_submitting(false)

    if (!result.ok) {
      whatsapp_window?.close()
      show_error_toast(result.message)
      return
    }

    if (whatsapp_window && result.data.whatsapp_url) {
      whatsapp_window.opener = null
      whatsapp_window.location.href = result.data.whatsapp_url
    } else if (can_send_whatsapp && trimmed_phone && result.data.whatsapp_url) {
      window.open(result.data.whatsapp_url, "_blank", "noopener,noreferrer")
    }

    reset_and_close_modal()
    show_success_toast("El enlace de reseña se generó correctamente.")
  }

  return (
    <section className="mt-6 w-full border-t border-border pt-5">
      <Button
        className={`h-11 w-full px-6 ${trigger_class_name ?? ""}`}
        onClick={open_modal}
        type="button"
      >
        <StarIcon className="size-4" />
        Calificar
      </Button>

      {is_open && (
        <div
          aria-labelledby="review-request-title"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !is_submitting) {
              reset_and_close_modal()
            }
          }}
          role="dialog"
        >
          <form
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl sm:p-8"
            noValidate
            onSubmit={handle_submit}
          >
            <Button
              aria-label="Cerrar datos del cliente"
              className="absolute right-4 top-4"
              disabled={is_submitting}
              onClick={reset_and_close_modal}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Cancel01Icon aria-hidden="true" className="size-5" />
            </Button>

            <div className="pr-10">
              <h2 className="font-heading text-2xl font-extrabold text-foreground" id="review-request-title">
                Datos del cliente
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Completá los datos para generar el enlace de reseña.
              </p>
            </div>

            <div className="mt-6 space-y-4 text-left">
              <div className="space-y-2">
                <Label className="text-foreground" htmlFor="review-client-name">Nombre del cliente</Label>
                <Input
                  aria-describedby="review-client-name-error"
                  aria-invalid={Boolean(field_errors.name)}
                  autoFocus
                  className="h-10 bg-background text-foreground"
                  disabled={is_submitting}
                  id="review-client-name"
                  maxLength={100}
                  minLength={2}
                  name="name"
                  onChange={handle_name_change}
                  placeholder="Ej.: María López"
                  required
                  value={name}
                />
                {field_errors.name && (
                  <p className="text-sm text-destructive" id="review-client-name-error">
                    {field_errors.name}
                  </p>
                )}
              </div>

              {can_send_whatsapp && (
                <div className="space-y-2">
                  <Label className="text-foreground" htmlFor="review-client-phone">Número de teléfono</Label>
                  <Input
                    aria-describedby="review-client-phone-feedback"
                    aria-invalid={Boolean(field_errors.phone)}
                    className="h-10 bg-background text-foreground"
                    disabled={is_submitting}
                    id="review-client-phone"
                    inputMode="tel"
                    name="phone"
                    onChange={handle_phone_change}
                    placeholder="Ej.: 3511234567"
                    type="tel"
                    value={phone}
                  />
                  <p
                    className={field_errors.phone ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
                    id="review-client-phone-feedback"
                  >
                    {field_errors.phone || "Ingresá 10 dígitos, con guion opcional. Sin 0, 15 o +54 al inicio."}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-foreground" htmlFor="review-client-email">Correo electrónico</Label>
                <Input
                  aria-describedby="review-client-email-feedback"
                  aria-invalid={Boolean(field_errors.email)}
                  className="h-10 bg-background text-foreground"
                  disabled={is_submitting}
                  id="review-client-email"
                  name="email"
                  onChange={handle_email_change}
                  placeholder="Ej.: ejemplo@gmail.com"
                  type="email"
                  value={email}
                />
                <p
                  className={field_errors.email ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
                  id="review-client-email-feedback"
                >
                  {field_errors.email || "Ingresá un correo válido. Ej: ejemplo@gmail.com"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                disabled={is_submitting}
                onClick={reset_and_close_modal}
                type="button"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button disabled={is_submitting} type="submit">
                {is_submitting ? (
                  <Loading03Icon className="size-4 animate-spin" />
                ) : (
                  <Link04Icon className="size-4" />
                )}
                {is_submitting ? "Generando…" : "Generar enlace"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
