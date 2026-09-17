# Documentación del frontend de OFFIX

## Alcance implementado

La aplicación Next.js está en `offix-frontend/`. Actualmente integra el login incorporado desde `main` y el flujo público de carga de reseñas. La creación inicial del enlace permanece en Swagger hasta que exista el perfil público desde el cual se invocará.

Una persona con un enlace válido puede reseñar sin iniciar sesión. El frontend nunca se conecta directamente a PostgreSQL ni contiene credenciales de Auth0, Brevo, WhatsApp o base de datos.

## Arquitectura y flujo de datos

- **Stack:** Next.js App Router, React, TypeScript estricto, Tailwind CSS, componentes locales de shadcn/ui sobre Base UI, Sonner, ReUI Rating y Huge Icons.
- **Servidor:** `src/app/resena/[code]/page.tsx` consulta el enlace con `cache: "no-store"` y decide si renderizar el formulario o un estado de enlace inválido, vencido o usado.
- **Cliente:** `Review_form` mantiene únicamente los valores aún no enviados, evita envíos duplicados y publica la reseña con `fetch` nativo.
- **API:** `src/features/reviews/api/reviews.ts` centraliza la URL pública, verifica respuestas desconocidas y devuelve errores tipados sin mostrar detalles internos.
- **Autenticación:** `/login`, `/api/auth/callback`, `/api/auth/logout` y `/` mantienen el flujo de sesión existente. Reseñas no importa ni exige ese estado.

```text
Swagger POST /oferentes/{id}/solicitudes-resena
                 |
                 v
       email o enlace de WhatsApp
                 |
                 v
GET /solicitudes-resena/{codigo} -- no utilizable --> estado informativo
                 |
              utilizable
                 v
       /resena/{codigo} + Review_form
                 |
                 v
           POST /resenas
                 |
                 v
 resumen local + estado backend Pendiente_Aceptacion
```

No se conservan mocks, rutas de prototipo, contexto global, `localStorage` ni datos de contacto inventados.

## Estructura relevante

```text
offix-frontend/src/
├── app/
│   ├── (auth)/login/
│   ├── api/auth/{callback,logout}/
│   ├── resena/[code]/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── reui/rating.tsx
│   └── ui/
└── features/reviews/
    ├── api/reviews.ts
    ├── components/
    ├── data/rating_categories.ts
    ├── lib/rating.ts
    └── types/review.ts
```

## Sistema visual

`globals.css` concentra los tokens: fondo `#BABCCA`, texto y superficie fuerte `#231942`, componentes `#6E8898` y hover secundario `#9FB1BC`. Los botones normales usan Montserrat `600`, fondo morado y texto del color del fondo general. Cancelar/cerrar conservan `outline` o `ghost`; eliminar conserva `destructive`.

Montserrat `800` se usa en títulos y Raleway `400` en cuerpo. Los íconos funcionales provienen de Huge Icons. Teléfono y correo son controles deshabilitados con texto morado y opacidad completa.

## Catálogo de componentes propios

### `RootLayout`

- **Ubicación:** `src/app/layout.tsx`.
- **Entorno e interfaz:** Server Component; recibe `children`.
- **Objetivo:** HTML español, metadatos, fuentes, CSS y `Toaster` global.
- **Estados/dependencias:** Sin estado; Next.js, Montserrat, Raleway y Sonner.
- **Personalización:** Metadatos, pesos de fuente y tokens globales.

### `Home`

- **Ubicación:** `src/app/page.tsx`.
- **Entorno e interfaz:** Server Component sin props.
- **Objetivo:** Lee la cookie de acceso, consulta `/auth/me` y muestra acceso o perfil.
- **Estados/dependencias:** Sin sesión, sesión válida o backend inaccesible; `cookies`, `fetch`, `Link` e `Image`.
- **Personalización:** Sólo presentación; no cambiar transporte o validación de sesión desde componentes visuales.

### `LoginPage`, `LoginForm` y `ErrorHandler`

- **Ubicación:** `src/app/(auth)/login/`.
- **Entorno:** Página servidor; formulario y manejador de query cliente.
- **Objetivo:** Presentar el acceso, iniciar Google/Auth0 desde el backend y mostrar errores de retorno.
- **Interfaz:** Sin props públicas.
- **Estados/dependencias:** Error ausente/presente; `NEXT_PUBLIC_API_URL`, `Suspense`, Sonner e imagen de marca.
- **Personalización:** Clases visuales y textos; el destino del login pertenece al contrato de autenticación.

### `Review_page`

- **Ubicación:** `src/app/resena/[code]/page.tsx`.
- **Entorno e interfaz:** Server Component dinámico; `params: Promise<{ code: string }>`.
- **Objetivo:** Obtener la solicitud real y seleccionar formulario o estado informativo.
- **Estados/dependencias:** Disponible, usada, vencida, inexistente, respuesta inválida o red caída; API de reseñas.
- **Personalización:** Mensajes de estado; la ruta singular coincide con `url_resena` del backend.

### `Review_form`

- **Ubicación:** `src/features/reviews/components/review_form.tsx`.
- **Entorno e interfaz:** Client Component; recibe `review_request: Review_request`.
- **Objetivo:** Mostrar datos precargados, editar ratings/comentario y enviar una vez.
- **Estados/dependencias:** Editable, enviando, error por toast y enviado; componentes UI, API, Huge Icons y helpers.
- **Personalización:** Límite de comentario, grillas y textos. El promedio siempre se deriva.
- **Accesibilidad:** Labels visibles, datos de contacto deshabilitados, contador asociado, headings y botón bloqueado durante el request.

### `Review_rating_field`

- **Ubicación:** `src/features/reviews/components/review_rating_field.tsx`.
- **Entorno e interfaz:** Client Component; `description`, `label`, `rating`, `on_change`.
- **Objetivo:** Categoría, ayuda, estrellas, valor y etiqueta cualitativa.
- **Estados/dependencias:** `0.5` a `5` en pasos de `0.5`; `Rating` y `get_rating_label`.
- **Personalización:** Contenido en `rating_categories.ts`, apariencia mediante tokens.

### `Submitted_review_card`

- **Ubicación:** `src/features/reviews/components/submitted_review_card.tsx`.
- **Entorno e interfaz:** Client Component; recibe comentario, ratings, solicitud y respuesta confirmada.
- **Objetivo:** Confirmar el envío, estado pendiente, profesional, promedio y desglose.
- **Estados/dependencias:** Con o sin comentario; Card, Huge Icons y helpers de rating.
- **Personalización:** `summary_columns` y textos de confirmación.

### `Review_link_status`

- **Ubicación:** `src/features/reviews/components/review_link_status.tsx`.
- **Entorno e interfaz:** Server compatible; `message` y `title` opcional.
- **Objetivo:** Estado accesible y uniforme para enlaces no utilizables.
- **Estados/dependencias:** Mensaje y título variables; Card y Huge Icons.
- **Personalización:** Texto y ancho de la tarjeta.

### `Rating`

- **Ubicación:** `src/components/reui/rating.tsx`.
- **Entorno e interfaz:** Client Component; valor, etiqueta ARIA, descripción, edición, máximo, callback, tamaño y clases.
- **Objetivo:** Rating de estrellas con medios puntos y teclado.
- **Estados/dependencias:** Editable/lectura y tamaños; ReUI, CVA y `StarIcon` de Huge Icons.
- **Personalización:** Variantes, `--rating` y atributos del range.

## Componentes shadcn/ui importados

| Componente | Ruta | Uso | Documentación |
| --- | --- | --- | --- |
| `Button` | `src/components/ui/button.tsx` | Confirmación y acciones | [Button](https://ui.shadcn.com/docs/components/button) |
| `Card` | `src/components/ui/card.tsx` | Datos, estados y resumen | [Card](https://ui.shadcn.com/docs/components/card) |
| `Input` | `src/components/ui/input.tsx` | Datos precargados no editables | [Input](https://ui.shadcn.com/docs/components/input) |
| `Label` | `src/components/ui/label.tsx` | Etiquetas de formulario | [Label](https://ui.shadcn.com/docs/components/label) |
| `Textarea` | `src/components/ui/textarea.tsx` | Comentario opcional | [Textarea](https://ui.shadcn.com/docs/components/textarea) |
| `Toaster` | `src/components/ui/sonner.tsx` | Errores de 5 s y éxitos de 3 s | [Sonner](https://ui.shadcn.com/docs/components/sonner) |

## Integraciones

| Integración | Estado |
| --- | --- |
| FastAPI | Activa mediante `NEXT_PUBLIC_API_URL` |
| Solicitud de reseña | Se genera temporalmente desde Swagger |
| Formulario público | Implementado en `/resena/[code]`, sin login |
| Moderación | Backend deja la reseña en `Pendiente_Aceptacion`; UI del profesional fuera de esta entrega |
| Auth0/Google | Integración de `main` preservada |
| PostgreSQL/Supabase | Sólo backend; sin conexión frontend |
| Email/WhatsApp | Backend genera/envía; el frontend sólo consume el enlace recibido |

## Mantenimiento

Actualizá este archivo cuando cambie una ruta, componente, integración o límite de renderizado. Actualizá también `README.md` cuando cambien configuración, comandos, puertos o pasos de QA.
