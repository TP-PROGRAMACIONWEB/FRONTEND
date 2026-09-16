import type { ReactNode } from "react";

import { Review_test_provider } from "@/features/reviews/context/review_test_context";

export default function Review_test_layout({ children }: { children: ReactNode }) {
  return (
    <Review_test_provider>{children}</Review_test_provider>
  );
}
