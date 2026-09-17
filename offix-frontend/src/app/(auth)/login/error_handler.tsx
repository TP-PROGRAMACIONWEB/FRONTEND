"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function ErrorHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("error") || searchParams.has("error_description")) {
      toast.error("No pudo autenticarse correctamente su usuario, vuelva a intentarlo", {
        id: "auth-error-toast",
        style: {
          background: "#EF4444", // Red-500
          color: "#F0F4EF",
          border: "1px solid #B91C1C", // Red-700
        },
        position: "top-right",
        duration: 5000,
      });
    }
  }, [searchParams]);

  return null;
}
