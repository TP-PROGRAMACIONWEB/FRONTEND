"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Review_rating_field } from "@/features/reviews/components/review_rating_field";
import { Submitted_review_card } from "@/features/reviews/components/submitted_review_card";
import { useReview_test } from "@/features/reviews/context/review_test_context";
import { rating_categories } from "@/features/reviews/data/review_test_mock";
import { get_average_rating, is_valid_rating } from "@/features/reviews/lib/rating";

const description_limit = 200;

export function Review_form() {
  const router = useRouter();
  const review = useReview_test();
  const has_contact = Boolean(review.phone || review.email);
  const average = get_average_rating(review.ratings);

  function handle_back() {
    review.set_must_reopen_contact(true);
    router.push("/review-test");
  }

  function handle_submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating_categories.every(({ key }) => is_valid_rating(review.ratings[key]))) {
      review.confirm_review();
    }
  }

  if (!has_contact) {
    return (
      <main className="grid min-h-screen place-items-center px-5 py-12">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="font-heading text-xl">
              No hay datos de contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-muted-foreground">
              Este prototipo conserva los datos solo mientras navegás entre sus rutas.
            </p>
            <Button onClick={() => router.push("/review-test")} type="button">
              Volver a Calificar
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (review.submitted) {
    return (
      <main className="min-h-screen px-5 py-10 sm:px-8">
        <Submitted_review_card />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-5 py-10 sm:px-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl">
          Formulario de Reseña del Servicio
        </h1>
        <p className="text-muted-foreground mt-2">
          Valorá la atención y el trabajo recibido.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handle_submit}>
        <section
          aria-labelledby="contact-heading"
          className="rounded-xl bg-card p-5 shadow-sm sm:p-6"
        >
          <h2 className="font-heading text-xl" id="contact-heading">
            Datos del Cliente
          </h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="review-phone">Número de Teléfono</Label>
              <Input
                className="disabled:text-foreground disabled:opacity-100"
                disabled
                id="review-phone"
                placeholder="No proporcionado"
                value={review.phone}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="review-email">Correo Electrónico</Label>
              <Input
                className="disabled:text-foreground disabled:opacity-100"
                disabled
                id="review-email"
                placeholder="No proporcionado"
                value={review.email}
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="rating-heading">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-xl" id="rating-heading">
                Puntuación
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Usá las estrellas para asignar valores de medio punto.
              </p>
            </div>
            <output className="w-fit rounded-lg border bg-card px-4 py-2 font-heading text-sm">
              Promedio general: {average.toFixed(1)} / 5
            </output>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {rating_categories.map((category) => (
              <Review_rating_field
                description={category.description}
                key={category.key}
                label={category.label}
                on_change={(rating) => review.update_rating(category.key, rating)}
                rating={review.ratings[category.key]}
              />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="description-heading"
          className="rounded-xl bg-card p-5 shadow-sm sm:p-6"
        >
          <Label
            className="font-heading text-lg"
            htmlFor="work-description"
            id="description-heading"
          >
            Descripción del trabajo
          </Label>
          <Textarea
            aria-describedby="description-help description-counter"
            className="mt-3 min-h-32 resize-y"
            id="work-description"
            maxLength={description_limit}
            onChange={(event) =>
              review.set_description(
                event.currentTarget.value.slice(0, description_limit),
              )
            }
            placeholder="Ingresá una descripción o comentario sobre el trabajo…"
            value={review.description}
          />
          <div className="text-muted-foreground mt-2 flex justify-between gap-4 text-sm">
            <p id="description-help">Campo opcional. Máximo 200 caracteres.</p>
            <p aria-live="polite" id="description-counter">
              {review.description.length} / {description_limit}
            </p>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button onClick={handle_back} type="button" variant="outline">
            Volver
          </Button>
          <Button type="submit">Confirmar</Button>
        </div>
      </form>
    </main>
  );
}
