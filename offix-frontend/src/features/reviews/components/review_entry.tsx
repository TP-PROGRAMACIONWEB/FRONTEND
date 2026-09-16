"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Client_data_dialog } from "@/features/reviews/components/client_data_dialog";
import { useReview_test } from "@/features/reviews/context/review_test_context";

export function Review_entry() {
  const { must_reopen_contact, set_must_reopen_contact } = useReview_test();
  const [dialog_is_open, set_dialog_is_open] = useState(must_reopen_contact);

  function handle_open_change(open: boolean) {
    set_dialog_is_open(open);
    if (!open) set_must_reopen_contact(false);
  }

  return (
    <main className="grid min-h-screen place-items-center px-5 py-16">
      <Button
        className="h-14 min-w-48 rounded-xl px-8 text-base shadow-lg"
        onClick={() => set_dialog_is_open(true)}
        type="button"
      >
        Calificar
      </Button>
      {dialog_is_open && (
        <Client_data_dialog on_open_change={handle_open_change} />
      )}
    </main>
  );
}
