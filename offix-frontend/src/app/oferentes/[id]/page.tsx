import {
  Alert02Icon,
  Call02Icon,
  Certificate01Icon,
  Clock01Icon,
  Location01Icon,
  Shield01Icon,
  StarIcon,
} from "hugeicons-react"
import {
  get_professional,
  get_professional_categories,
} from "@/features/professionals/api/professionals"
import { Back_navigation_link } from "@/features/navigation/components/back_navigation_link"
import { Application_header } from "@/features/navigation/components/application_header"
import { Review_request_button } from "@/features/reviews/components/review_request_button"
import { get_current_user } from "@/lib/session"

export const dynamic = "force-dynamic"

type Professional_page_props = {
  params: Promise<{ id: string }>
}

export default async function Professional_page({ params }: Professional_page_props) {
  const { id } = await params
  const professional_id = Number(id)

  if (!Number.isInteger(professional_id) || professional_id < 1) {
    return <Profile_error message="El perfil profesional no existe." />
  }

  const [professional_result, categories_result, current_user] = await Promise.all([
    get_professional(professional_id),
    get_professional_categories(),
    get_current_user(),
  ])

  if (!professional_result.ok) {
    return <Profile_error message={professional_result.message} />
  }

  const professional = professional_result.data
  const category = categories_result.ok
    ? categories_result.data.find((item) => item.id_categoria === professional.categoria_id)?.nombre
    : undefined
  const schedule = professional.hora_inicio_atencion && professional.hora_fin_atencion
    ? `${professional.hora_inicio_atencion.slice(0, 5)} a ${professional.hora_fin_atencion.slice(0, 5)}`
    : null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Application_header />
      <main className="flex-1 px-5 py-10">
        <article className="mx-auto max-w-2xl rounded-3xl bg-card p-6 shadow-2xl sm:p-8">

        <header className="border-b border-border pb-6">
          <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-foreground font-heading text-2xl font-extrabold text-background">
            {professional.nombre.charAt(0)}{professional.apellido.charAt(0)}
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-foreground">
            {professional.nombre} {professional.apellido}
          </h1>
          <p className="mt-1 text-muted-foreground">{category ?? "Categoría sin información"}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-2 rounded-full bg-muted px-3 py-2">
              <StarIcon className="size-4" />
              {Number(professional.promedio_calificacion).toFixed(1)} de 5
            </span>
            <span className="flex items-center gap-2 rounded-full bg-muted px-3 py-2">
              <Shield01Icon className="size-4" />
              {professional.estado_verificacion}
            </span>
          </div>
        </header>

        <section className="grid gap-4 py-6 sm:grid-cols-2">
          <Profile_detail icon={<Call02Icon />} label="Teléfono" value={professional.telefono} />
          {professional.numero_matricula && (
            <Profile_detail
              icon={<Certificate01Icon />}
              label="Matrícula"
              value={professional.numero_matricula}
            />
          )}
          {schedule && <Profile_detail icon={<Clock01Icon />} label="Horario" value={schedule} />}
          {professional.radio_cobertura_km !== null && (
            <Profile_detail
              icon={<Location01Icon />}
              label="Cobertura"
              value={`${professional.radio_cobertura_km} km`}
            />
          )}
          {professional.disponible_emergencia && (
            <Profile_detail icon={<Alert02Icon />} label="Emergencias" value="Disponible" />
          )}
        </section>

        {professional.descripcion && (
          <section className="border-t border-border pt-6">
            <h2 className="font-heading text-xl font-extrabold text-foreground">Sobre su trabajo</h2>
            <p className="mt-2 leading-7">{professional.descripcion}</p>
          </section>
        )}

        <Review_request_button
          can_send_whatsapp={current_user?.rol === "Oferente"}
          oferente_id={professional.id_oferente}
        />
        <div className="mt-3">
          <Back_navigation_link href="/oferentes" label="Volver a profesionales" />
        </div>
        </article>
      </main>
    </div>
  )
}

function Profile_detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3 rounded-xl bg-muted p-4">
      <span className="mt-0.5 [&_svg]:size-5">{icon}</span>
      <div>
        <h2 className="font-heading text-sm font-semibold text-foreground">{label}</h2>
        <p className="mt-1 text-sm">{value}</p>
      </div>
    </div>
  )
}

function Profile_error({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Application_header />
      <main className="grid flex-1 place-items-center p-5">
      <section className="w-full max-w-md rounded-2xl bg-card p-6 text-center shadow-2xl">
        <h1 className="font-heading text-2xl font-extrabold">No pudimos mostrar el perfil</h1>
        <p className="mt-3">{message}</p>
        <div className="mt-5">
          <Back_navigation_link href="/oferentes" label="Volver a profesionales" />
        </div>
      </section>
      </main>
    </div>
  )
}
