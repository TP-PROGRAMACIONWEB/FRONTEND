import { cookies } from 'next/headers';
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
      <div className="min-h-screen bg-[#B4CDED] flex flex-col items-center justify-center p-4">
        <div className="bg-[#213144] p-8 rounded-3xl shadow-2xl text-center border-2 border-[#333A2C]">
          <img src="/logos/logo-completo-blanco.png" alt="OFFIX Logo" className="h-12 w-auto mb-6 mx-auto" />
          <h1 className="text-2xl font-bold text-[#F0F4EF] mb-4 font-heading">
            No has iniciado sesión
          </h1>
          <Link
            href="/login"
            className="inline-flex items-center justify-center bg-[#F0F4EF] text-[#0D1821] font-bold h-12 px-6 rounded-2xl hover:bg-white transition-colors"
          >
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#B4CDED] flex flex-col font-sans">
      <header className="w-full bg-[#213144] border-b-2 border-[#333A2C] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logos/logo-simple-blanco.png" alt="OFFIX Logo" className="h-8 w-auto" />
          <span className="text-[#F0F4EF] font-bold text-xl tracking-wide">OFFIX</span>
        </div>

        <a
          href="/api/auth/logout"
          className="inline-flex items-center justify-center bg-[#15202B] text-[#F0F4EF] font-bold h-10 px-5 rounded-2xl hover:bg-black/40 transition-colors border border-[#333A2C]"
        >
          Cerrar sesión
        </a>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#213144] border-2 border-[#333A2C] rounded-3xl shadow-2xl p-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-[#B4CDED]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-bold text-[#F0F4EF] mb-6 font-heading border-b border-[#333A2C] pb-4">
              Perfil del usuario
            </h2>

            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#333A2C] flex items-center justify-center text-[#F0F4EF] text-2xl font-bold">
                {user.nombre?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>

              <div className="space-y-1">
                <p className="text-lg font-medium text-[#F0F4EF]">{user.nombre}</p>
                <p className="text-sm text-[#B4CDED]">{user.email}</p>
                <p className="text-xs text-[#B4CDED]/70 mt-2">Rol: {user.rol}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
