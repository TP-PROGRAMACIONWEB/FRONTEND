"use client"

import {
  Cancel01Icon,
  Certificate01Icon,
  CheckmarkBadge01Icon,
  Logout01Icon,
  Menu01Icon,
  Search01Icon,
  UserCircleIcon,
} from "hugeicons-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Review_notifications_panel } from "@/features/reviews/components/review_notifications_panel"
import type { Review_notification } from "@/features/reviews/types/review"

type Dashboard_controls_props = {
  initial_notifications: Review_notification[]
  profile_name: string
  user_role?: string
  has_validated_license?: boolean
}

type Open_panel = "menu" | "notifications" | null

export function Dashboard_controls({
  initial_notifications,
  profile_name,
  user_role,
  has_validated_license = false,
}: Dashboard_controls_props) {
  const [open_panel, set_open_panel] = useState<Open_panel>(null)

  useEffect(() => {
    function handle_key_down(event: KeyboardEvent) {
      if (event.key === "Escape") set_open_panel(null)
    }

    window.addEventListener("keydown", handle_key_down)
    return () => window.removeEventListener("keydown", handle_key_down)
  }, [])

  const close_panels = () => set_open_panel(null)

  return (
    <>
      <div className="flex items-center gap-2">
        <Review_notifications_panel
          initial_notifications={initial_notifications}
          is_open={open_panel === "notifications"}
          on_open_change={(is_open) => set_open_panel(is_open ? "notifications" : null)}
        />
        <Button
          aria-controls="account-menu-panel"
          aria-expanded={open_panel === "menu"}
          aria-label="Abrir menú de navegación"
          className="text-background hover:bg-background/15 hover:text-background"
          onClick={() => set_open_panel((current) => current === "menu" ? null : "menu")}
          size="icon-lg"
          type="button"
          variant="ghost"
        >
          <Menu01Icon className="size-5" />
        </Button>
      </div>

      {open_panel && (
        <button
          aria-label="Cerrar panel"
          className="fixed inset-0 z-40 cursor-pointer bg-foreground/35 backdrop-blur-[1px]"
          onClick={close_panels}
          type="button"
        />
      )}
      {open_panel === "menu" && (
        <aside
          aria-label="Menú de navegación"
          aria-modal="true"
          className="fixed inset-y-0 right-0 z-50 flex w-[min(22rem,82vw)] flex-col bg-card shadow-2xl"
          id="account-menu-panel"
          role="dialog"
        >
          <header className="flex items-start justify-between gap-4 bg-foreground p-5 text-background sm:p-6">
            <div className="flex min-w-0 items-center gap-3">
              <UserCircleIcon className="size-8 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs text-background/70">Perfil</p>
                <div className="flex items-center gap-1.5">
                  <h2 className="truncate font-heading text-lg font-extrabold">{profile_name}</h2>
                  {has_validated_license && (
                    <span
                      aria-label="Matrícula profesional verificada"
                      className="inline-flex shrink-0 items-center text-primary-foreground"
                      title="Matrícula profesional verificada"
                    >
                      <CheckmarkBadge01Icon className="size-5 fill-emerald-500 text-foreground" />
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Button
              aria-label="Cerrar menú"
              className="shrink-0 text-background hover:bg-background/15 hover:text-background"
              onClick={close_panels}
              size="icon"
              type="button"
              variant="ghost"
            >
              <Cancel01Icon />
            </Button>
          </header>

          <nav aria-label="Secciones" className="flex-1 p-4 sm:p-5">
            <p className="px-3 font-heading text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              Navegación
            </p>
            <Link
              className="mt-3 flex items-center gap-3 rounded-xl bg-background px-4 py-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              href="/oferentes"
              onClick={close_panels}
            >
              <Search01Icon className="size-5 shrink-0" aria-hidden="true" />
              <span>
                <span className="block font-heading font-semibold">Ver oferentes</span>
                <span className="block text-xs text-muted-foreground">(test)</span>
              </span>
            </Link>

            {user_role === "Oferente" && !has_validated_license && (
              <Link
                className="mt-2 flex items-center gap-3 rounded-xl bg-background px-4 py-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                href="/validar-matricula"
                onClick={close_panels}
              >
                <Certificate01Icon className="size-5 shrink-0" aria-hidden="true" />
                <span>
                  <span className="block font-heading font-semibold">Validar matrícula</span>
                  <span className="block text-xs text-muted-foreground">Fidelizá tu oficio</span>
                </span>
              </Link>
            )}
          </nav>

          <footer className="p-4 sm:p-5">
            <a
              className={buttonVariants({ className: "h-11 w-full" })}
              href="/api/auth/logout"
            >
              <Logout01Icon data-icon="inline-start" />
              Cerrar sesión
            </a>
          </footer>
        </aside>
      )}
    </>
  )
}
