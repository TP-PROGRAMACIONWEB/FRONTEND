"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

import { initial_review_test_state } from "@/features/reviews/data/review_test_mock";
import type {
  Rating_key,
  Review_test_state,
} from "@/features/reviews/types/review";

type Review_test_context_value = Review_test_state & {
  confirm_review: () => void;
  save_contact: (phone: string, email: string) => void;
  set_description: (description: string) => void;
  set_must_reopen_contact: (must_reopen: boolean) => void;
  update_rating: (key: Rating_key, rating: number) => void;
};

const Review_test_context = createContext<Review_test_context_value | null>(null);

export function Review_test_provider({ children }: { children: ReactNode }) {
  const [review_state, set_review_state] = useState(initial_review_test_state);

  const context_value: Review_test_context_value = {
    ...review_state,
    save_contact: (phone, email) =>
      set_review_state((current_state) => ({
        ...current_state,
        phone,
        email,
        must_reopen_contact: false,
        submitted: false,
      })),
    update_rating: (key, rating) =>
      set_review_state((current_state) => ({
        ...current_state,
        ratings: { ...current_state.ratings, [key]: rating },
      })),
    set_description: (description) =>
      set_review_state((current_state) => ({
        ...current_state,
        description,
      })),
    set_must_reopen_contact: (must_reopen_contact) =>
      set_review_state((current_state) => ({
        ...current_state,
        must_reopen_contact,
      })),
    confirm_review: () =>
      set_review_state((current_state) => ({
        ...current_state,
        submitted: true,
      })),
  };

  return (
    <Review_test_context.Provider value={context_value}>
      {children}
    </Review_test_context.Provider>
  );
}

export function useReview_test() {
  const context = useContext(Review_test_context);
  if (!context) {
    throw new Error("useReview_test debe usarse dentro de Review_test_provider.");
  }
  return context;
}
