"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rating_categories } from "@/features/reviews/data/review_test_mock";
import { useReview_test } from "@/features/reviews/context/review_test_context";
import { get_average_rating, get_rating_label } from "@/features/reviews/lib/rating";
import type { Rating_key } from "@/features/reviews/types/review";

const summary_columns: readonly Rating_key[][] = [
  ["punctuality", "quality"],
  ["price", "attention"],
];

export function Submitted_review_card() {
  const { description, email, phone, ratings } = useReview_test();
  const average = get_average_rating(ratings);

  return (
    <Card className="mx-auto w-full max-w-3xl shadow-lg">
      <CardHeader className="border-b pb-4">
        <CardTitle className="font-heading text-xl">
          Promedio general: {average.toFixed(1)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {phone && (
            <div>
              <dt className="text-muted-foreground">Número de Teléfono</dt>
              <dd>{phone}</dd>
            </div>
          )}
          {email && (
            <div>
              <dt className="text-muted-foreground">Correo electrónico</dt>
              <dd className="break-all">{email}</dd>
            </div>
          )}
        </dl>

        <div className="grid gap-4 sm:grid-cols-2">
          {summary_columns.map((column) => (
            <dl className="space-y-3" key={column.join("-")}>
              {column.map((key) => {
                const category = rating_categories.find((item) => item.key === key);
                if (!category) return null;
                const rating = ratings[key];

                return (
                  <div className="rounded-lg border p-3" key={key}>
                    <dt className="font-heading">{category.label}</dt>
                    <dd className="mt-1">
                      {rating.toFixed(1)} / 5 · {get_rating_label(rating)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          ))}
        </div>

        <div className="border-t pt-5">
          <h3 className="font-heading">Descripción del trabajo</h3>
          <p className={description ? "mt-2 whitespace-pre-wrap" : "text-muted-foreground mt-2 italic"}>
            {description || "No se agregó una descripción."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
