"use client"

import { CheckmarkCircle02Icon } from "hugeicons-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { rating_categories } from "@/features/reviews/data/rating_categories"
import { get_average_rating, get_rating_label } from "@/features/reviews/lib/rating"
import type {
  Rating_key,
  Rating_values,
  Review_request,
  Submitted_review,
} from "@/features/reviews/types/review"

const summary_columns: readonly Rating_key[][] = [
  ["punctuality", "quality"],
  ["price", "attention"],
]

type Submitted_review_card_props = {
  description: string
  ratings: Rating_values
  review_request: Review_request
  submitted_review: Submitted_review
}

export function Submitted_review_card({
  description,
  ratings,
  review_request,
  submitted_review,
}: Submitted_review_card_props) {
  const average = get_average_rating(ratings)

  return (
    <main className="grid min-h-screen place-items-center px-5 py-10 sm:px-8">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="border-b pb-4">
          <div className="mb-2 flex items-center gap-3">
            <CheckmarkCircle02Icon className="size-7 text-foreground" />
            <CardTitle className="font-heading text-xl font-extrabold">
              Reseña enviada
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Gracias, {submitted_review.nombre_cliente}. La reseña quedó pendiente de
            aceptación por parte del profesional.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Profesional</p>
            <p className="font-heading font-semibold">{review_request.nombre_oferente}</p>
          </div>

          <h2 className="font-heading text-lg font-extrabold">
            Promedio general: {average.toFixed(1)} / 5
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {summary_columns.map((column) => (
              <dl className="space-y-3" key={column.join("-")}>
                {column.map((key) => {
                  const category = rating_categories.find((item) => item.key === key)
                  if (!category) return null
                  const rating = ratings[key]

                  return (
                    <div className="rounded-lg border p-3" key={key}>
                      <dt className="font-heading font-semibold">{category.label}</dt>
                      <dd className="mt-1">
                        {rating.toFixed(1)} / 5 · {get_rating_label(rating)}
                      </dd>
                    </div>
                  )
                })}
              </dl>
            ))}
          </div>

          <div className="border-t pt-5">
            <h3 className="font-heading font-extrabold">Descripción del trabajo</h3>
            <p
              className={
                description
                  ? "mt-2 whitespace-pre-wrap"
                  : "mt-2 italic text-muted-foreground"
              }
            >
              {description || "No se agregó una descripción."}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
