import { Suspense } from "react";
import { LoginForm } from "./login_form";
import { ErrorHandler } from "./error_handler";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#B4CDED] flex flex-col items-center justify-center relative overflow-hidden font-sans">
      <Suspense fallback={null}>
        <ErrorHandler />
      </Suspense>

      {/* Pill Badge at the top center */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 bg-[#213144] border border-[#333A2C] px-4 py-1.5 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#34A853]" />
          <span className="text-xs font-medium text-[#B4CDED] tracking-wide uppercase">
            Portal de Acceso
          </span>
        </div>
      </div>

      {/* Centered Login Card */}
      <div className="relative w-full max-w-sm mx-4 bg-[#213144] border-2 border-[#333A2C] rounded-3xl shadow-2xl p-8 z-10 overflow-hidden">

        {/* Decorative Blurred Circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-[#B4CDED]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-[#333A2C]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <img src="/logos/logo-completo-blanco.png" alt="OFFIX Logo" className="h-12 w-auto mb-6" />
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#F0F4EF] mb-2 tracking-tight font-heading">
              Iniciar sesión
            </h1>
            <p className="text-sm text-[#B4CDED]">
              Seleccione su cuenta para continuar
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
