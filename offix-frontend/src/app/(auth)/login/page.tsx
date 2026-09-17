import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login_form";
import { ErrorHandler } from "./error_handler";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background font-sans">
      <Suspense fallback={null}>
        <ErrorHandler />
      </Suspense>

      {/* Pill Badge at the top center */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full bg-foreground px-4 py-1.5 shadow-sm">
          <div className="size-2 rounded-full bg-primary" />
          <span className="font-heading text-xs font-semibold uppercase tracking-wide text-background">
            Portal de Acceso
          </span>
        </div>
      </div>

      {/* Centered Login Card */}
      <div className="relative z-10 mx-4 w-full max-w-sm overflow-hidden rounded-3xl bg-card p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex size-20 items-center justify-center rounded-full bg-foreground">
            <Image
              alt="OFFIX"
              className="size-10 object-contain"
              height={40}
              priority
              src="/logos/logo-simple-blanco.png"
              width={40}
            />
          </div>
          <div className="mb-8">
            <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight text-foreground">
              Iniciar sesión
            </h1>
            <p className="text-sm text-muted-foreground">
              Seleccioná tu cuenta para continuar
            </p>
          </div>

          <LoginForm />
          <Link
            className="mt-5 font-heading text-sm font-semibold text-foreground underline"
            href="/oferentes"
          >
            Ver profesionales sin iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
