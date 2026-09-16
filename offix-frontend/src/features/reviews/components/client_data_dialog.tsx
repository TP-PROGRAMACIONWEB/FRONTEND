"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { show_error_toast, Toaster } from "@/components/ui/sonner";
import { useReview_test } from "@/features/reviews/context/review_test_context";
import {
  get_email_error,
  get_phone_error,
  is_valid_email,
  is_valid_phone,
  normalize_phone,
} from "@/features/reviews/lib/review_validation";

const contact_error_message =
  "Debe completar al menos un dato de contacto para poder generar el enlace.";

type Client_data_dialog_props = {
  on_open_change: (open: boolean) => void;
};

export function Client_data_dialog({
  on_open_change,
}: Client_data_dialog_props) {
  const router = useRouter();
  const { email, phone, save_contact } = useReview_test();
  const [submitted_once, set_submitted_once] = useState(false);
  const [is_navigating, start_navigation] = useTransition();

  const phone_error = get_phone_error(phone);
  const email_error = get_email_error(email);
  const phone_is_valid = is_valid_phone(phone);
  const email_is_valid = is_valid_email(email);
  const has_valid_contact = phone_is_valid || email_is_valid;
  const phone_is_invalid = Boolean(phone_error) || (submitted_once && !has_valid_contact);
  const email_is_invalid = Boolean(email_error) || (submitted_once && !has_valid_contact);

  function handle_submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    set_submitted_once(true);

    if (!has_valid_contact) {
      window.setTimeout(() => show_error_toast(contact_error_message), 0);
      return;
    }

    save_contact(
      phone_is_valid ? normalize_phone(phone) : "",
      email_is_valid ? email : "",
    );
    start_navigation(() => router.push("/form-review-test"));
  }

  return (
    <Dialog open onOpenChange={on_open_change}>
      <DialogContent className="sm:max-w-md">
        <Toaster position="top-center" richColors />
        <form onSubmit={handle_submit}>
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Datos cliente</DialogTitle>
            <DialogDescription>
              Ingresá al menos un medio de contacto válido.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="client-phone">Número de Teléfono</Label>
              <Input
                aria-describedby="client-phone-feedback"
                aria-invalid={phone_is_invalid}
                autoComplete="tel"
                id="client-phone"
                inputMode="tel"
                onChange={(event) => save_contact(event.currentTarget.value, email)}
                placeholder="Ej.: +54 9 11 5555-1234"
                value={phone}
              />
              <p
                className={phone_is_invalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}
                id="client-phone-feedback"
              >
                {phone_error ??
                  (submitted_once && !has_valid_contact
                    ? "Ingresá un teléfono válido o usá el correo."
                    : "Los espacios, +, guiones y paréntesis se quitarán al continuar.")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-email">Correo electrónico</Label>
              <Input
                aria-describedby="client-email-feedback"
                aria-invalid={email_is_invalid}
                autoComplete="email"
                id="client-email"
                inputMode="email"
                onChange={(event) => save_contact(phone, event.currentTarget.value)}
                placeholder="Ej.: cliente@correo.com"
                type="text"
                value={email}
              />
              <p
                className={email_is_invalid ? "text-destructive text-sm" : "text-muted-foreground text-sm"}
                id="client-email-feedback"
              >
                {email_error ??
                  (submitted_once && !has_valid_contact
                    ? "Ingresá un correo válido o usá el teléfono."
                    : "Debe contener @, no tener espacios y finalizar en .com.")}
              </p>
            </div>
          </div>

          <DialogFooter className="bg-transparent">
            <Button
              disabled={is_navigating}
              onClick={() => on_open_change(false)}
              type="button"
              variant="outline"
            >
              Cancelar
            </Button>
            <Button disabled={is_navigating} type="submit">
              {is_navigating ? "Abriendo…" : "Generar Enlace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
