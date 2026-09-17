import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let user = null;

  if (token) {
    try {
      // Fetch user profile from the backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        // We can use Next.js cache options if needed, but for auth we usually want fresh data or specific revalidation
        cache: 'no-store'
      });

      if (res.ok) {
        user = await res.json();
      } else {
        console.warn("Invalid token or backend error:", res.status);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="rounded-3xl border-2 border-border bg-foreground p-8 text-center shadow-2xl">
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
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 font-heading font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="flex w-full items-center justify-between border-b-2 border-border bg-foreground px-6 py-4">
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

        <a
          href="/api/auth/logout"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 font-heading font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Cerrar sesión
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-border bg-foreground p-8 shadow-2xl">
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
                <p className="text-lg text-background">{user.nombre}</p>
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
