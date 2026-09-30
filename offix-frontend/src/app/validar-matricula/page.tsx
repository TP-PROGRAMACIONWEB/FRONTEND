import { redirect } from "next/navigation"
import { Certificate01Icon } from "hugeicons-react"

import { Application_header } from "@/features/navigation/components/application_header"
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
      <Application_header />

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
