"use client"

import { useState, type FormEvent } from "react"
import {
  Link04Icon,
  Loading03Icon,
  StarIcon,
  WhatsappIcon,
} from "hugeicons-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { show_error_toast, show_success_toast } from "@/components/ui/sonner"
import { create_review_invitation } from "@/features/reviews/api/reviews"
import type { Review_invitation } from "@/features/reviews/types/review"

type Review_request_button_props = {
  oferente_id: number
}

type Field_name = "name" | "phone" | "email" | "contact"
type Field_errors = Partial<Record<Field_name, string>>

const phone_pattern = /^\d{3,4}-?\d{6,7}$/

export function Review_request_button({ oferente_id }: Review_request_button_props) {
  const [is_open, set_is_open] = useState(false)
  const [is_submitting, set_is_submitting] = useState(false)
  const [field_errors, set_field_errors] = useState<Field_errors>({})
  const [invitation, set_invitation] = useState<Review_invitation | null>(null)

  function clear_field_error(field: Field_name) {
    set_field_errors((current) => ({ ...current, [field]: undefined, contact: undefined }))
  }

  async function handle_submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const phone = String(form.get("phone") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const email_input = event.currentTarget.elements.namedItem("email")
    const errors: Field_errors = {}

    if (!name) {
      errors.name = "Ingresá el nombre del cliente."
    } else if (name.length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres."
    } else if (name.length > 100) {
      errors.name = "El nombre no puede superar los 100 caracteres."
    }

    if (phone && (!phone_pattern.test(phone) || phone.replace("-", "").length !== 10)) {
      errors.phone = "Ingresá 10 dígitos, con guion opcional, sin 0, 15 ni +54."
    }

    if (
      email &&
      email_input instanceof HTMLInputElement &&
      email_input.validity.typeMismatch
    ) {
      errors.email = "Ingresá un correo válido, por ejemplo: ejemplo@gmail.com."
    }

    if (!phone && !email) {
      errors.contact = "Ingresá al menos un teléfono o un correo electrónico."
    }

    if (Object.keys(errors).length > 0) {
      set_field_errors(errors)
      show_error_toast("Revisá los campos marcados antes de continuar.")
      return
    }

    set_field_errors({})
    set_is_submitting(true)
    const result = await create_review_invitation(oferente_id, {
      nombre_cliente: name,
      telefono_cliente: phone || null,
      email_cliente: email || null,
    })
    set_is_submitting(false)

    if (!result.ok) {
      show_error_toast(result.message)
      return
    }

    set_invitation(result.data)
    show_success_toast("El enlace de reseña se generó correctamente.")
  }

  if (invitation) {
    return (
      <section className="mt-6 w-full space-y-4 border-t border-border pt-5 text-left">
        <div>
          <h3 className="font-heading font-semibold text-foreground">Enlace generado</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {invitation.email_enviado
              ? "También se envió al correo indicado."
              : "Compartilo con el cliente para que complete la reseña."}
          </p>
        </div>
        {invitation.whatsapp_url && (
          <a
            className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-background bg-foreground px-4 py-2 font-heading text-sm font-semibold text-background transition-colors hover:bg-[color-mix(in_oklch,var(--foreground),var(--background)_15%)]"
            href={invitation.whatsapp_url}
            rel="noreferrer"
            target="_blank"
          >
            <WhatsappIcon className="size-4" />
            Compartir por WhatsApp
          </a>
        )}
        <Button
          className="w-full"
          onClick={() => {
            set_invitation(null)
            set_is_open(true)
          }}
          type="button"
        >
          Generar otro enlace
        </Button>
      </section>
    )
  }

  return (
    <section className="mt-6 w-full border-t border-border pt-5">
      <Button
        className="h-11 w-full px-6"
        onClick={() => set_is_open((current) => !current)}
        type="button"
      >
        <StarIcon className="size-4" />
        Calificar
      </Button>

      {is_open && (
        <form className="mt-5 space-y-4 text-left" noValidate onSubmit={handle_submit}>
          <div className="space-y-2">
            <Label className="text-foreground" htmlFor="review-client-name">Nombre del cliente</Label>
            <Input
              aria-describedby="review-client-name-error"
              aria-invalid={Boolean(field_errors.name)}
              className="h-10 bg-background text-foreground"
              id="review-client-name"
              maxLength={100}
              minLength={2}
              name="name"
              onChange={() => clear_field_error("name")}
              placeholder="Ej.: María López"
              required
            />
            {field_errors.name && (
              <p className="text-sm text-destructive" id="review-client-name-error">
                {field_errors.name}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-foreground" htmlFor="review-client-phone">Teléfono</Label>
            <Input
              aria-describedby="review-client-phone-error review-contact-feedback"
              aria-invalid={Boolean(field_errors.phone || field_errors.contact)}
              className="h-10 bg-background text-foreground"
              id="review-client-phone"
              inputMode="tel"
              name="phone"
              onChange={() => clear_field_error("phone")}
              pattern="(?:[0-9]{3}-?[0-9]{7}|[0-9]{4}-?[0-9]{6})"
              placeholder="Ej.: 3511234567"
              title="Ingresá 10 dígitos, sin 0, 15 ni +54."
            />
            {field_errors.phone && (
              <p className="text-sm text-destructive" id="review-client-phone-error">
                {field_errors.phone}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-foreground" htmlFor="review-client-email">Correo electrónico</Label>
            <Input
              aria-describedby="review-client-email-error review-contact-feedback"
              aria-invalid={Boolean(field_errors.email || field_errors.contact)}
              className="h-10 bg-background text-foreground"
              id="review-client-email"
              name="email"
              onChange={() => clear_field_error("email")}
              placeholder="Ej.: ejemplo@gmail.com"
              type="email"
            />
            {field_errors.email && (
              <p className="text-sm text-destructive" id="review-client-email-error">
                {field_errors.email}
              </p>
            )}
          </div>
          <p
            className={field_errors.contact ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
            id="review-contact-feedback"
          >
            {field_errors.contact || "Completá al menos un medio de contacto. El correo se envía al confirmar."}
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button onClick={() => set_is_open(false)} type="button" variant="outline">
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
      )}
    </section>
  )
}
