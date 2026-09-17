import { Suspense } from "react";
import Image from "next/image";
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
        <div className="flex items-center gap-2 rounded-full border border-border bg-foreground px-4 py-1.5 shadow-sm">
          <div className="size-2 rounded-full bg-primary" />
          <span className="font-heading text-xs font-semibold uppercase tracking-wide text-background">
            Portal de Acceso
          </span>
        </div>
      </div>

      {/* Centered Login Card */}
      <div className="relative z-10 mx-4 w-full max-w-sm overflow-hidden rounded-3xl border-2 border-border bg-foreground p-8 shadow-2xl">

        {/* Decorative Blurred Circles */}
        <div className="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 size-32 rounded-full bg-background/15 blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 -mb-10 -ml-10 size-32 rounded-full bg-primary/40 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <Image
            alt="OFFIX"
            className="mb-6 h-12 w-auto"
            height={48}
            priority
            src="/logos/logo-completo-blanco.png"
            width={146}
          />
          <div className="mb-8">
            <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight text-background">
              Iniciar sesión
            </h1>
            <p className="text-sm text-background">
              Seleccione su cuenta para continuar
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
