"use client"

import { Loading03Icon, SentIcon } from "hugeicons-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { show_error_toast, show_success_toast } from "@/components/ui/sonner"
import { Textarea } from "@/components/ui/textarea"
import { create_review } from "@/features/reviews/api/reviews"
import { Review_rating_field } from "@/features/reviews/components/review_rating_field"
import { Submitted_review_card } from "@/features/reviews/components/submitted_review_card"
import {
  initial_ratings,
  rating_categories,
} from "@/features/reviews/data/rating_categories"
import { get_average_rating, is_valid_rating } from "@/features/reviews/lib/rating"
import type {
  Rating_values,
  Review_request,
  Submitted_review,
} from "@/features/reviews/types/review"

const description_limit = 200

type Review_form_props = {
  review_request: Review_request
}

export function Review_form({ review_request }: Review_form_props) {
  const [ratings, set_ratings] = useState<Rating_values>(initial_ratings)
  const [description, set_description] = useState("")
  const [submitted_review, set_submitted_review] =
    useState<Submitted_review | null>(null)
  const [is_submitting, set_is_submitting] = useState(false)
  const average = get_average_rating(ratings)

  function update_rating(key: keyof Rating_values, rating: number) {
    set_ratings((current_ratings) => ({ ...current_ratings, [key]: rating }))
  }

  async function handle_submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!rating_categories.every(({ key }) => is_valid_rating(ratings[key]))) {
      show_error_toast("Completá todas las puntuaciones antes de confirmar.")
      return
    }

    set_is_submitting(true)
    const result = await create_review({
      codigo_unico: review_request.codigo_unico,
      calificaciones_comentarios: {
        criterios: {
          precio: ratings.price,
          calidad: ratings.quality,
          atencion: ratings.attention,
          puntualidad: ratings.punctuality,
        },
        comentario: description.trim() || null,
      },
    })
    set_is_submitting(false)

    if (!result.ok) {
      show_error_toast(result.message)
      return
    }

    set_submitted_review(result.data)
    show_success_toast("La reseña se envió correctamente.")
  }

  if (submitted_review) {
    return (
      <Submitted_review_card
        description={description}
        ratings={ratings}
        review_request={review_request}
        submitted_review={submitted_review}
      />
    )
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-extrabold sm:text-3xl">
          Formulario de Reseña del Servicio
        </h1>
        <p className="mt-2 text-muted-foreground">
          Valorá la atención y el trabajo de {review_request.nombre_oferente}.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handle_submit}>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl font-extrabold">
              Datos del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="review-name">Nombre</Label>
              <Input
                className="disabled:text-foreground disabled:opacity-100"
                disabled
                id="review-name"
                value={review_request.nombre_cliente}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-phone">Número de Teléfono</Label>
              <Input
                className="disabled:text-foreground disabled:opacity-100"
                disabled
                id="review-phone"
                placeholder="No proporcionado"
                value={review_request.telefono_cliente ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-email">Correo Electrónico</Label>
              <Input
                className="disabled:text-foreground disabled:opacity-100"
                disabled
                id="review-email"
                placeholder="No proporcionado"
                value={review_request.email_cliente ?? ""}
              />
            </div>
          </CardContent>
        </Card>

        <section aria-labelledby="rating-heading">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-extrabold" id="rating-heading">
                Puntuación
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Usá las estrellas para asignar valores de medio punto.
              </p>
            </div>
            <output className="w-fit rounded-lg border bg-card px-4 py-2 font-heading text-sm font-semibold">
              Promedio general: {average.toFixed(1)} / 5
            </output>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {rating_categories.map((category) => (
              <Review_rating_field
                description={category.description}
                key={category.key}
                label={category.label}
                on_change={(rating) => update_rating(category.key, rating)}
                rating={ratings[category.key]}
              />
            ))}
          </div>
        </section>

        <Card>
          <CardContent>
            <Label
              className="font-heading text-lg font-extrabold"
              htmlFor="work-description"
            >
              Descripción del trabajo
            </Label>
            <Textarea
              aria-describedby="description-help description-counter"
              className="mt-3 min-h-32 resize-y"
              id="work-description"
              maxLength={description_limit}
              onChange={(event) => set_description(event.currentTarget.value)}
              placeholder="Ingresá una descripción o comentario sobre el trabajo…"
              value={description}
            />
            <div className="mt-2 flex justify-between gap-4 text-sm text-muted-foreground">
              <p id="description-help">Campo opcional. Máximo 200 caracteres.</p>
              <p aria-live="polite" id="description-counter">
                {description.length} / {description_limit}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button disabled={is_submitting} size="lg" type="submit">
            {is_submitting ? (
              <Loading03Icon className="animate-spin" data-icon="inline-start" />
            ) : (
              <SentIcon data-icon="inline-start" />
            )}
            {is_submitting ? "Enviando…" : "Confirmar"}
          </Button>
        </div>
      </form>
    </main>
  )
}
