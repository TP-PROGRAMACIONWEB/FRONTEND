import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // Delete the access token cookie to log out locally
  cookieStore.delete('access_token');

  // We could also call the backend logout endpoint here if needed,
  // but the OpenAPI says: "El cierre de sesión real lo hace el cliente descartando el token guardado."
  // And it returns 204 if we send the token to `POST /api/v1/auth/logout`.

  // Try to notify the backend (fire and forget, since it's stateless anyway)
  // We don't block the UI if it fails.
  if (token) {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (e) {
      console.warn("Error calling backend logout:", e);
    }
  }

  // Redirect back to the login page
  return NextResponse.redirect(new URL('/login', request.url));
}
