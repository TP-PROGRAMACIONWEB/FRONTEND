import { ArrowRight01Icon, Home01Icon, StarIcon, UserGroupIcon } from "hugeicons-react"
import Image from "next/image"
import Link from "next/link"

import {
  get_professional_categories,
  get_professionals,
} from "@/features/professionals/api/professionals"

export const dynamic = "force-dynamic"

export default async function Professionals_page() {
  const [professionals_result, categories_result] = await Promise.all([
    get_professionals(),
    get_professional_categories(),
  ])

  const categories = new Map(
    categories_result.ok
      ? categories_result.data.map((category) => [category.id_categoria, category.nombre])
      : [],
  )

  return (
    <div className="flex min-h-screen flex-col bg-background">
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
          <Home01Icon aria-hidden="true" className="size-4" />
          Inicio
        </Link>
      </header>

      <main className="flex-1 px-5 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-3">
              <UserGroupIcon className="size-8 text-foreground" />
              <h1 className="font-heading text-3xl font-extrabold text-foreground">
                Profesionales disponibles
              </h1>
            </div>
            <p>Consultá perfiles reales y generá una invitación para calificar su trabajo.</p>
          </div>

          {!professionals_result.ok ? (
            <section className="rounded-2xl bg-card p-6 shadow-lg">
              <h2 className="font-heading text-xl font-extrabold">No pudimos mostrar los perfiles</h2>
              <p className="mt-2">{professionals_result.message} Intentá nuevamente más tarde.</p>
            </section>
          ) : professionals_result.data.length === 0 ? (
            <section className="rounded-2xl bg-card p-6 shadow-lg">
              <h2 className="font-heading text-xl font-extrabold">Todavía no hay profesionales</h2>
            </section>
          ) : (
            <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {professionals_result.data.map((professional) => (
                <article
                  className="flex flex-col rounded-2xl bg-card p-6 shadow-lg"
                  key={professional.id_oferente}
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-foreground font-heading text-xl font-extrabold text-background">
                    {professional.nombre.charAt(0)}{professional.apellido.charAt(0)}
                  </div>
                  <h2 className="font-heading text-xl font-extrabold text-foreground">
                    {professional.nombre} {professional.apellido}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {professional.categoria_id
                      ? categories.get(professional.categoria_id) ?? "Categoría sin información"
                      : "Categoría sin información"}
                  </p>
                  <p className="mt-4 flex items-center gap-2 text-sm">
                    <StarIcon className="size-4 text-foreground" />
                    {Number(professional.promedio_calificacion).toFixed(1)} de 5
                  </p>
                  <Link
                    className="mt-6 flex h-11 items-center justify-center gap-2 rounded-lg bg-foreground px-4 font-heading text-sm font-semibold text-background transition-colors hover:bg-[color-mix(in_oklch,var(--foreground),var(--background)_15%)]"
                    href={`/oferentes/${professional.id_oferente}`}
                  >
                    Ver perfil
                    <ArrowRight01Icon className="size-4" />
                  </Link>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
