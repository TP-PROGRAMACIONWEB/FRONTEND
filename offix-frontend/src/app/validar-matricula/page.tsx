import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowLeft01Icon, Certificate01Icon } from "hugeicons-react"

import { CheckmarkBadge01Icon } from "hugeicons-react"
import { get_current_user, professional_has_valid_license } from "@/lib/session"

import { License_validation_form } from "./components/license_validation_form"

export const dynamic = "force-dynamic"

export default async function Validar_matricula_page() {
  const user = await get_current_user()

  if (!user) {
    redirect("/login")
  }

  // Únicamente los usuarios con rol Oferente pueden validar una matrícula profesional
  if (user.rol !== "Oferente") {
    redirect("/")
  }

  // Verificamos si ya cuenta con matrícula validada activa
  const has_valid_license = await professional_has_valid_license()

  if (has_valid_license) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="flex w-full items-center justify-between gap-4 bg-foreground px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            alt="OFFIX"
            className="h-8 w-auto"
            height={32}
            priority
            src="/logos/logo-simple-blanco.png"
            width={32}
          />
          <span className="font-heading text-xl font-extrabold tracking-wide text-background">OFFIX</span>
        </div>

        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-background/40 px-4 font-heading text-sm font-semibold text-background transition-colors hover:bg-background/15 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-background/40"
          href="/"
        >
          <ArrowLeft01Icon aria-hidden="true" className="size-4" />
          Inicio
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:py-12">
        <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-5">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-foreground text-background">
              <Certificate01Icon className="size-6" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-extrabold text-foreground">
                Validar matrícula
              </h1>
              <p className="text-xs text-muted-foreground">
                Fidelización contra el padrón oficial de oficios
              </p>
            </div>
          </div>

          <License_validation_form />
        </div>
      </main>
    </div>
  )
}
