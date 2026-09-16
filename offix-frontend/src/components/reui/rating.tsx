"use client"

import type { ComponentProps } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { StarIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const ratingVariants = cva("flex items-center", {
  variants: {
    size: {
      sm: "gap-2",
      default: "gap-2.5",
      lg: "gap-3",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const starVariants = cva("", {
  variants: {
    size: {
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

const valueVariants = cva("text-muted-foreground w-5", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type Rating_props = Omit<ComponentProps<"div">, "onChange"> &
  VariantProps<typeof ratingVariants> & {
    aria_describedby?: string
    aria_label: string
    editable?: boolean
    max_rating?: number
    on_rating_change?: (rating: number) => void
    rating: number
    show_value?: boolean
    star_class_name?: string
  }

function Rating({
  aria_describedby,
  aria_label,
  rating,
  max_rating = 5,
  size,
  className,
  star_class_name,
  show_value = false,
  editable = false,
  on_rating_change,
  ...props
}: Rating_props) {
  const stars = Array.from({ length: max_rating }, (_, index) => {
    const fill_percentage = Math.min(Math.max((rating - index) * 100, 0), 100)

    return (
      <span aria-hidden="true" className="relative" key={index}>
        <StarIcon className={cn(starVariants({ size }), "text-muted-foreground/35")} />
        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill_percentage}%` }}>
          <StarIcon className={cn(starVariants({ size }), "fill-(--rating) text-(--rating)")} />
        </span>
      </span>
    )
  })

  return (
    <div
      data-slot="rating"
      className={cn(ratingVariants({ size }), className)}
      {...props}
    >
      <div className="relative flex items-center rounded-md p-1 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50">
        {stars}
        {editable && (
          <input
            aria-describedby={aria_describedby}
            aria-label={aria_label}
            aria-valuetext={`${rating.toFixed(1)} de ${max_rating}`}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
            max={max_rating}
            min={0.5}
            onChange={(event) => on_rating_change?.(event.currentTarget.valueAsNumber)}
            step={0.5}
            type="range"
            value={rating}
          />
        )}
      </div>
      {show_value && (
        <span
          data-slot="rating-value"
          className={cn(valueVariants({ size }), star_class_name)}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export { Rating }
