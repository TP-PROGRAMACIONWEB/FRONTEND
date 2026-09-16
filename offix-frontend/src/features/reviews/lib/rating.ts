import { rating_keys, type Rating_values } from "@/features/reviews/types/review";

export function get_rating_label(rating: number) {
  if (rating <= 1) return "Bajo";
  if (rating <= 2.5) return "Regular";
  if (rating === 3) return "Aceptable";
  if (rating <= 4) return "Muy bueno";
  return "Excelente";
}

export function get_average_rating(ratings: Rating_values) {
  const total = rating_keys.reduce((sum, key) => sum + ratings[key], 0);
  return total / rating_keys.length;
}

export function is_valid_rating(rating: number) {
  return rating >= 0.5 && rating <= 5 && Number.isInteger(rating * 2);
}
