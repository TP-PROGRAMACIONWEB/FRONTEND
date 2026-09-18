import Image from 'next/image';
import Link from 'next/link';
import { CheckmarkBadge01Icon } from 'hugeicons-react';

import { Dashboard_controls } from '@/features/navigation/components/dashboard_controls';
import { is_review_notification } from '@/features/reviews/api/review_notifications';
import type { Review_notification } from '@/features/reviews/types/review';
import { get_current_user, professional_has_valid_license } from '@/lib/session';
import { request_authenticated_backend } from '@/lib/authenticated_backend';

export default async function Home() {
  const user = await get_current_user();

  let initial_notifications: Review_notification[] = [];
  let has_validated_license = false;

  if (user) {
    try {
      const notifications_res = await request_authenticated_backend('/notificaciones');
      if (notifications_res && notifications_res.ok) {
        const notifications: unknown = await notifications_res.json();
        if (Array.isArray(notifications) && notifications.every(is_review_notification)) {
          initial_notifications = notifications;
        }
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }

    if (user.rol === 'Oferente') {
      has_validated_license = await professional_has_valid_license();
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="rounded-3xl bg-foreground p-8 text-center shadow-2xl">
          <Image
            alt="OFFIX"
            className="mx-auto mb-6 h-12 w-auto"
            height={48}
            priority
            src="/logos/logo-completo-blanco.png"
            width={146}
          />
          <h1 className="mb-4 font-heading text-2xl font-extrabold text-background">
            No has iniciado sesión
          </h1>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-background bg-foreground px-6 font-heading font-semibold text-background transition-colors hover:bg-[color-mix(in_oklch,var(--foreground),var(--background)_15%)]"
          >
            Ir al inicio de sesión
          </Link>
          <Link
            href="/oferentes"
            className="mt-4 block font-heading text-sm font-semibold text-background underline"
          >
            Ver profesionales
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="flex w-full items-center justify-between bg-foreground px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            alt="OFFIX"
            className="h-8 w-auto"
            height={32}
            priority
            src="/logos/logo-simple-blanco.png"
            width={32}
          />
          <span className="font-heading text-xl font-extrabold tracking-wide text-background">OFFIX</span>
        </div>

        <Dashboard_controls
          has_validated_license={has_validated_license}
          initial_notifications={initial_notifications}
          profile_name={user.nombre || user.email}
          user_role={user.rol}
        />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-foreground p-8 shadow-2xl">
          <div className="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 size-32 rounded-full bg-background/15 blur-2xl" />

          <div className="relative z-10 text-center">
            <h2 className="mb-6 border-b border-border pb-4 font-heading text-2xl font-extrabold text-background">
              Perfil del usuario
            </h2>

            <div className="flex flex-col items-center gap-4">
              <div className="flex size-20 items-center justify-center rounded-full bg-primary font-heading text-2xl font-extrabold text-primary-foreground">
                {user.nombre?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <p className="text-lg text-background">{user.nombre}</p>
                  {has_validated_license && (
                    <span
                      aria-label="Matrícula profesional verificada"
                      className="inline-flex shrink-0 items-center text-primary-foreground"
                      title="Matrícula profesional verificada"
                    >
                      <CheckmarkBadge01Icon className="size-5 fill-emerald-500 text-foreground" />
                    </span>
                  )}
                </div>
                <p className="text-sm text-background">{user.email}</p>
                <p className="mt-2 text-xs text-background/70">Rol: {user.rol}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
