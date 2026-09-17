"use client"

import {
  Call02Icon,
  Cancel01Icon,
  Loading03Icon,
  Mail01Icon,
  Notification02Icon,
  RefreshIcon,
  Tick02Icon,
} from "hugeicons-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  get_review_notifications,
  moderate_review,
} from "@/features/reviews/api/review_notifications"
import type { Review_notification } from "@/features/reviews/types/review"

type Review_notifications_panel_props = {
  initial_notifications: Review_notification[]
  is_open: boolean
  on_open_change: (is_open: boolean) => void
}

const notification_date_formatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Argentina/Buenos_Aires",
})

function format_notification_date(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : notification_date_formatter.format(date)
}

export function Review_notifications_panel({
  initial_notifications,
  is_open,
  on_open_change,
}: Review_notifications_panel_props) {
  const router = useRouter()
  const [notifications, set_notifications] = useState<Review_notification[]>(initial_notifications)
  const [error_message, set_error_message] = useState<string | null>(null)
  const [is_loading, set_is_loading] = useState(false)
  const [pending_review_id, set_pending_review_id] = useState<number | null>(null)

  const pending_notifications = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          notification.tipo === "Resena_Nueva" &&
          notification.requiere_accion &&
          notification.estado === "Pendiente" &&
          notification.resena_id !== null,
      ),
    [notifications],
  )

  async function load_notifications() {
    set_is_loading(true)
    const result = await get_review_notifications()

    if (result.ok) {
      set_notifications(result.data)
      set_error_message(null)
    } else {
      set_error_message(result.message)
    }

    set_is_loading(false)
  }

  function handle_toggle() {
    const next_is_open = !is_open
    on_open_change(next_is_open)
    if (next_is_open) void load_notifications()
  }

  async function handle_moderation(review_id: number, accept: boolean) {
    set_pending_review_id(review_id)
    const result = await moderate_review(review_id, accept)

    if (!result.ok) {
      toast.error(result.message, { duration: 5000 })
      set_pending_review_id(null)
      return
    }

    set_notifications((current) =>
      current.filter((notification) => notification.resena_id !== review_id),
    )
    toast.success(
      accept
        ? "Reseña aceptada y publicada."
        : "Reseña rechazada. No se publicará ni sumará al promedio.",
      { duration: 3000 },
    )
    set_pending_review_id(null)
    router.refresh()
  }

  return (
    <>
      <Button
        aria-controls="review-notifications-panel"
        aria-expanded={is_open}
        aria-label="Abrir notificaciones de reseñas"
        className="relative text-background hover:bg-background/15 hover:text-background"
        onClick={handle_toggle}
        size="icon-lg"
        type="button"
        variant="ghost"
      >
        <Notification02Icon className="size-5" />
        {pending_notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[0.65rem] leading-none text-white">
            {pending_notifications.length > 99 ? "99+" : pending_notifications.length}
          </span>
        )}
      </Button>

      {is_open && <aside
        aria-label="Notificaciones de reseñas"
        aria-modal="true"
        className="fixed top-20 right-4 z-50 flex max-h-[calc(100dvh-6rem)] w-[calc(100%-2rem)] max-w-md flex-col overflow-hidden rounded-2xl bg-card shadow-2xl sm:right-6"
        id="review-notifications-panel"
        role="dialog"
      >
      <header className="flex items-center justify-between bg-foreground px-5 py-4 text-background">
        <div className="flex items-center gap-2">
          <Notification02Icon className="size-5" aria-hidden="true" />
          <h2 className="font-heading text-lg font-extrabold">Notificaciones</h2>
        </div>
        <Button
          aria-label="Cerrar notificaciones"
          className="text-background hover:bg-background/15 hover:text-background"
          onClick={() => on_open_change(false)}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Cancel01Icon />
        </Button>
      </header>

      <div className="overflow-y-auto p-4 sm:p-5">
        <p className="mb-4 text-sm text-muted-foreground">
          Aceptar publica la reseña y actualiza tu promedio. Rechazarla evita que se publique.
        </p>

        {is_loading && pending_notifications.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loading03Icon className="size-5 animate-spin" aria-hidden="true" />
            Cargando notificaciones…
          </div>
        )}

        {!is_loading && error_message && pending_notifications.length === 0 && (
          <div className="rounded-xl bg-muted p-4 text-center">
            <p className="text-sm">{error_message}</p>
            <Button className="mt-4" onClick={() => void load_notifications()} type="button">
              <RefreshIcon data-icon="inline-start" />
              Reintentar
            </Button>
          </div>
        )}

        {!is_loading && !error_message && pending_notifications.length === 0 && (
          <div className="rounded-xl bg-muted p-6 text-center">
            <Notification02Icon className="mx-auto size-7 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 font-heading font-semibold">No tenés reseñas pendientes.</p>
          </div>
        )}

        {pending_notifications.length > 0 && (
          <div className="space-y-4">
            {pending_notifications.map((notification) => {
              const review_id = notification.resena_id
              if (review_id === null) return null

              const is_submitting = pending_review_id === review_id

              return (
                <article
                  className="rounded-2xl bg-background p-4 shadow-sm"
                  key={notification.id_notificacion}
                >
                  <time className="text-xs text-muted-foreground" dateTime={notification.fecha_creacion}>
                    {format_notification_date(notification.fecha_creacion)}
                  </time>
                  <p className="mt-3 text-sm leading-6">
                    {notification.nombre_cliente ?? "Un cliente"} dejó una reseña sobre tu trabajo.{" "}
                    Revisá los datos de contacto y decidí si la aceptás.
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-foreground">
                    {notification.telefono_cliente && (
                      <p className="flex items-center gap-2">
                        <Call02Icon className="size-4" aria-hidden="true" />
                        <span>{notification.telefono_cliente}</span>
                      </p>
                    )}
                    {notification.email_cliente && (
                      <p className="flex items-center gap-2 break-all">
                        <Mail01Icon className="size-4 shrink-0" aria-hidden="true" />
                        <span>{notification.email_cliente}</span>
                      </p>
                    )}
                  </div>

                  <p className="mt-4 font-heading text-sm font-semibold">
                    ¿Confirmás que corresponde a un cliente tuyo?
                  </p>
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
                    <Button
                      disabled={pending_review_id !== null}
                      onClick={() => void handle_moderation(review_id, false)}
                      type="button"
                      variant="destructive"
                    >
                      {is_submitting ? (
                        <Loading03Icon className="animate-spin" data-icon="inline-start" />
                      ) : (
                        <Cancel01Icon data-icon="inline-start" />
                      )}
                      Rechazar
                    </Button>
                    <Button
                      disabled={pending_review_id !== null}
                      onClick={() => void handle_moderation(review_id, true)}
                      type="button"
                    >
                      {is_submitting ? (
                        <Loading03Icon className="animate-spin" data-icon="inline-start" />
                      ) : (
                        <Tick02Icon data-icon="inline-start" />
                      )}
                      Aceptar
                    </Button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
      </aside>}
    </>
  )
}
