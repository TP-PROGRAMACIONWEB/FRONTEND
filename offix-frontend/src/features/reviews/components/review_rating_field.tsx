"use client";

import { Rating } from "@/components/reui/rating";
import { get_rating_label } from "@/features/reviews/lib/rating";

type Review_rating_field_props = {
  description: string;
  label: string;
  on_change: (rating: number) => void;
  rating: number;
};

export function Review_rating_field({
  description,
  label,
  on_change,
  rating,
}: Review_rating_field_props) {
  const description_id = `rating-${label.toLowerCase()}-description`;

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-baseline justify-between gap-3">
        <h4 className="font-heading text-base">{label}</h4>
        <output className="font-heading text-sm">{rating.toFixed(1)} / 5</output>
      </div>
      <p className="text-muted-foreground mt-1 text-sm" id={description_id}>
        {description}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Rating
          aria_describedby={description_id}
          aria_label={`Puntuación de ${label}`}
          editable
          on_rating_change={on_change}
          rating={rating}
          size="lg"
        />
        <span className="rounded-full bg-muted px-3 py-1 text-sm">
          {get_rating_label(rating)}
        </span>
      </div>
    </div>
  );
}
