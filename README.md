# Frontend de OFFIX

OFFIX conecta clientes con profesionales de distintos oficios. La aplicación Next.js se encuentra en `offix-frontend/`; ejecutá desde esa carpeta todos los comandos de pnpm.

La arquitectura y el catálogo de componentes se documentan en [DOCUMENTATION.md](./DOCUMENTATION.md). Las reglas de desarrollo están en [AGENTS.md](./AGENTS.md).

## Requisitos

- Node.js 20.9 o posterior; se recomienda Node.js 24 LTS.
- pnpm 12.4.1.
- Backend de OFFIX disponible para autenticación y reseñas.

No uses npm, Yarn ni Bun para instalar dependencias.

## Instalación

```bash
cd offix-frontend
pnpm install --frozen-lockfile
```

El frontend usa Next.js, React, TypeScript, Tailwind CSS, primitivas Base UI para los componentes locales de shadcn/ui, Sonner, ReUI Rating y Huge Icons. `package.json` y `pnpm-lock.yaml` son la fuente de verdad de las versiones.

## Variables de entorno

Copiá `offix-frontend/.env.example` como `offix-frontend/.env.local` y configurá:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

`NEXT_PUBLIC_API_URL` es pública porque el navegador la utiliza para enviar la reseña y comenzar el login. No agregues secretos al frontend ni los prefijes con `NEXT_PUBLIC_`.

## Desarrollo

Levantá primero el backend en el puerto 8000. Después ejecutá:

```bash
cd offix-frontend
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000). La documentación interactiva del backend se encuentra en [http://localhost:8000/docs](http://localhost:8000/docs).

## Comandos

| Comando | Uso |
| --- | --- |
| `pnpm dev` | Levanta el frontend en desarrollo |
| `pnpm lint` | Ejecuta ESLint |
| `pnpm build` | Compila y valida producción |
| `pnpm start` | Sirve una compilación ya generada |

## Verificación de reseñas para QA

La navegación pública `/oferentes` muestra los profesionales reales del backend. Cada detalle `/oferentes/{id}` incluye `Calificar`; no requiere iniciar sesión. Swagger sigue disponible como alternativa de QA.

1. Abrí `http://localhost:3000/oferentes`, elegí un profesional, presioná `Calificar` y cargá el nombre del cliente junto con al menos un teléfono o correo válido.
2. Si cargaste teléfono, compartí la invitación mediante WhatsApp. Si cargaste correo, el backend envía el enlace al confirmar.
3. Como alternativa de QA, ejecutá en Swagger `POST /api/v1/oferentes/{oferente_id}/solicitudes-resena` con un oferente existente y abrí el `url_resena` devuelto.
4. Verificá que nombre, teléfono y correo provengan del backend, se vean en morado y no sean editables.
5. Modificá las cuatro puntuaciones en pasos de `0.5`; comprobá el promedio y las etiquetas.
6. Ingresá, si querés, un comentario de hasta 200 caracteres.
7. Confirmá una sola vez. Debe aparecer el resumen y el backend debe dejar la reseña en `Pendiente_Aceptacion`.
8. Volvé a abrir el mismo enlace: debe informar que ya fue utilizado.
9. Probá además un código inexistente y verificá el estado de enlace no disponible.

El listado, el perfil y el formulario de reseña son públicos. Los errores usan toasts de 5 segundos y los éxitos de 3 segundos.

## Verificación de autenticación

- `/login` inicia el flujo delegado al backend mediante Google/Auth0.
- `/api/auth/callback` y `/api/auth/logout` conservan el comportamiento incorporado desde `main`.
- `/` consulta `/auth/me` cuando existe la cookie `access_token`.

La integración de reseñas no modifica esas rutas ni su transporte de sesión.

## Problemas frecuentes

### El puerto 3000 está ocupado

Detené el otro servidor con `Ctrl+C`. No pruebes el enlace en otro puerto sin cambiar también la configuración del backend, porque `url_resena` se genera con la URL base configurada allí.

### Swagger muestra `Failed to fetch`

Abrilo como `http://localhost:8000/docs`. Mezclar `127.0.0.1` y `localhost` produce orígenes diferentes para CORS.

### Next.js informa un filesystem lento

Es una advertencia de rendimiento del modo desarrollo, no un error funcional. En Windows puede aparecer cuando el proyecto está en una unidad lenta o sincronizada.

### Aparece un hydration mismatch con `data-scribe-recorder-ready`

Ese atributo lo inyecta una extensión del navegador. Desactivala para `localhost` o probá en incógnito; no proviene del HTML de OFFIX.

## Verificación antes de entregar

```bash
cd offix-frontend
pnpm lint
pnpm build
```

No se mantiene una suite automatizada permanente en este repositorio.
