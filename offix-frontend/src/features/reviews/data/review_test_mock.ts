import type {
  Rating_category,
  Rating_values,
  Review_test_state,
} from "@/features/reviews/types/review";

export const rating_categories: readonly Rating_category[] = [
  {
    key: "punctuality",
    label: "Puntualidad",
    description: "Cumplimiento de los horarios y plazos acordados.",
  },
  {
    key: "price",
    label: "Precio",
    description: "Relación entre el costo y el servicio brindado.",
  },
  {
    key: "quality",
    label: "Calidad",
    description: "Excelencia técnica, terminación y resultados.",
  },
  {
    key: "attention",
    label: "Atención",
    description: "Trato, comunicación, cordialidad y predisposición.",
  },
];

export const initial_ratings: Rating_values = {
  punctuality: 2.5,
  price: 2.5,
  quality: 2.5,
  attention: 2.5,
};

export const initial_review_test_state: Review_test_state = {
  phone: "",
  email: "",
  ratings: initial_ratings,
  description: "",
  must_reopen_contact: false,
  submitted: false,
};
