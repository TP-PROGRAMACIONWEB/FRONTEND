"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { show_error_toast } from "@/components/ui/sonner";

export function ErrorHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has("error") || searchParams.has("error_description")) {
      show_error_toast("No pudo autenticarse correctamente su usuario, vuelva a intentarlo", {
        id: "auth-error-toast",
      });
    }
  }, [searchParams]);

  return null;
}
