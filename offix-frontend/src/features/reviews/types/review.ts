export const rating_keys = [
  "punctuality",
  "price",
  "quality",
  "attention",
] as const;

export type Rating_key = (typeof rating_keys)[number];

export type Rating_values = Record<Rating_key, number>;

export type Rating_category = {
  description: string;
  key: Rating_key;
  label: string;
};

export type Review_test_state = {
  description: string;
  email: string;
  must_reopen_contact: boolean;
  phone: string;
  ratings: Rating_values;
  submitted: boolean;
};
