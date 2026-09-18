# Documentación del frontend de OFFIX

## Alcance implementado

La aplicación Next.js está en `offix-frontend/`. Actualmente integra el login incorporado desde `main`, la consulta pública de profesionales, la generación de solicitudes desde un perfil real, el flujo público de carga y la moderación de reseñas por el oferente autenticado.

Una persona con un enlace válido puede reseñar sin iniciar sesión. El frontend nunca se conecta directamente a PostgreSQL ni contiene credenciales de Auth0, Brevo, WhatsApp o base de datos.

## Arquitectura y flujo de datos

- **Stack:** Next.js App Router, React, TypeScript estricto, Tailwind CSS, componentes locales de shadcn/ui sobre Base UI, Sonner, ReUI Rating y Huge Icons.
- **Servidor:** `/oferentes` y `/oferentes/[id]` consultan perfiles públicos reales; `src/app/resena/[code]/page.tsx` consulta el enlace y decide si renderizar el formulario o un estado no utilizable.
- **Cliente:** `Review_request_button` genera el enlace para el oferente mostrado. `Review_form` mantiene únicamente los valores aún no enviados, evita envíos duplicados y publica la reseña con `fetch` nativo.
- **API:** los módulos de `features/professionals` y `features/reviews` validan respuestas desconocidas y usan la URL centralizada en `src/lib/api.ts`. Las rutas servidoras `/api/reviews/notifications` y `/api/reviews/[review_id]/moderate` agregan el token guardado en la cookie `HttpOnly` antes de llamar a FastAPI.
- **Autenticación:** `/login`, `/api/auth/callback`, `/api/auth/logout` y `/` mantienen el flujo de sesión existente. La carga de reseñas sigue siendo pública; únicamente la bandeja y la moderación requieren la sesión del oferente.
- **Autorización:** FastAPI filtra la bandeja por `usuario_id` y valida que el oferente autenticado sea dueño de la reseña. El frontend no intenta reemplazar esas reglas con filtros visuales.

```text
GET /oferentes --> /oferentes/{id} + Review_request_button
                 |
                 v
POST /oferentes/{id}/solicitudes-resena
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
                 |
                 v
 campana autenticada --> PATCH /resenas/{id}/moderar
                          | aceptar: publica y recalcula promedio
                          └ rechazar: no publica ni suma al promedio
```

No se conservan mocks, rutas de prototipo, contexto global, `localStorage` ni datos de contacto inventados.

## Estructura relevante

```text
offix-frontend/src/
├── app/
│   ├── (auth)/login/
│   ├── api/auth/{callback,logout}/
│   ├── api/matriculas/validar/route.ts
│   ├── api/reviews/{notifications,[review_id]/moderate}/
│   ├── oferentes/{page.tsx,[id]/page.tsx}
│   ├── resena/[code]/page.tsx
│   ├── validar-matricula/{page.tsx,components/license_validation_form.tsx}
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── reui/rating.tsx
│   └── ui/
├── features/
│   ├── professionals/
│   │   ├── api/professionals.ts
│   │   └── types/professional.ts
│   └── reviews/
│       ├── api/reviews.ts
│       ├── components/
│       ├── data/rating_categories.ts
│       ├── lib/rating.ts
│       └── types/review.ts
│   └── navigation/components/dashboard_controls.tsx
└── lib/{api,authenticated_backend}.ts
```

## Sistema visual

`globals.css` concentra los tokens: fondo lavanda `#F3F0F7`, cards y formularios `#FAF8FC`, texto y superficie fuerte `#231942`, componentes `#6E8898` y hover secundario `#9FB1BC`. Los botones normales usan Montserrat `600`, fondo morado y texto del color del fondo general; su hover aclara el morado mezclándolo con el fondo aprobado. Cancelar/cerrar conservan `outline` o `ghost`; eliminar conserva `destructive`.

Las cards y el header principal no usan contornos grises; la separación se resuelve con color, espacio y sombra. Los bordes internos de campos, separadores y foco se conservan por legibilidad y accesibilidad.

Los inputs y textareas conservan su borde para delimitar claramente los campos y muestran un `ring` visible al recibir foco o al quedar inválidos. La tarjeta de login replica la composición clara del perfil profesional, con avatar de marca, título morado y acceso público a profesionales.

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
- **Objetivo:** Lee la cookie de acceso, consulta `/auth/me` y, si el usuario tiene rol `Oferente`, consulta `/oferentes/me/matriculas` para determinar si posee matrícula validada activa. En sesión válida delega la campana, el menú lateral, el rol y el estado de matrícula a `Dashboard_controls`, y exhibe la insignia de verificado en la tarjeta de perfil si corresponde.
- **Estados/dependencias:** Sin sesión, sesión válida o backend inaccesible; `cookies`, `fetch`, `Link`, `Image`, `CheckmarkBadge01Icon` y `Dashboard_controls`. El acceso público al listado permanece disponible sin sesión.
- **Personalización:** Sólo presentación; no cambiar transporte o validación de sesión desde componentes visuales.

### `Dashboard_controls`

- **Ubicación:** `src/features/navigation/components/dashboard_controls.tsx`.
- **Entorno e interfaz:** Client Component; recibe `profile_name: string`, `initial_notifications: Review_notification[]`, `user_role?: string` y `has_validated_license?: boolean`.
- **Objetivo:** Reemplazar el logout directo del header por la campana y el menú hamburguesa. El menú se abre desde la derecha, muestra el nombre del perfil con una insignia de verificado (`CheckmarkBadge01Icon`) si `has_validated_license` es true, enlaza a `Ver oferentes`, ofrece la opción condicional `Validar matrícula` para oferentes no validados y mantiene `Cerrar sesión` al pie.
- **Estados/dependencias:** Ningún panel, notificaciones o menú abierto; `Button`, `Link`, Huge Icons y `Review_notifications_panel`.
- **Personalización:** Secciones futuras del menú y ancho responsive. El panel móvil no supera el 82 % del viewport.
- **Accesibilidad:** Botones con nombre, `aria-expanded`, cierre por fondo o tecla Escape y paneles rotulados como diálogo.

### `Review_notifications_panel`

- **Ubicación:** `src/features/reviews/components/review_notifications_panel.tsx`.
- **Entorno e interfaz:** Client Component; recibe `is_open`, `on_close` y `on_pending_count_change`.
- **Objetivo:** Consultar las notificaciones del usuario autenticado, mostrar únicamente reseñas pendientes de decisión y permitir aceptarlas o rechazarlas.
- **Estados/dependencias:** Cargando, vacío, error recuperable y moderación pendiente; API interna de reseñas, Sonner, `Button`, Huge Icons y `router.refresh()`.
- **Personalización:** Textos, ancho y distribución de las tarjetas. La propiedad, publicación y cálculo del promedio pertenecen al backend.
- **Accesibilidad:** Fechas semánticas, datos de contacto como texto no editable, controles rotulados y bloqueo de acciones duplicadas.

### `Professionals_page`

- **Ubicación:** `src/app/oferentes/page.tsx`.
- **Entorno e interfaz:** Server Component dinámico sin props.
- **Objetivo:** Listar los oferentes reales, enlazar cada tarjeta a su perfil público y ofrecer un encabezado visible con acceso al inicio.
- **Estados/dependencias:** Listado, vacío o error de conexión; API de profesionales, categorías, `Image`, `Link` y Huge Icons.
- **Personalización:** Encabezado, botón `Inicio`, grilla, resumen de tarjeta y textos; nunca fijar un `id_oferente` en el frontend.

### `Professional_page`, `Profile_detail` y `Profile_error`

- **Ubicación:** `src/app/oferentes/[id]/page.tsx`.
- **Entorno e interfaz:** Server Components; la página recibe `params: Promise<{ id: string }>` y los auxiliares reciben datos presentacionales.
- **Objetivo:** Mostrar un perfil público real, sus datos disponibles y la entrada al flujo de reseña.
- **Estados/dependencias:** Perfil válido, ID inválido, inexistente o backend inaccesible; API de profesionales, `Review_request_button`, `Link` y Huge Icons.
- **Personalización:** Distribución, botón `Volver a profesionales` y campos visibles aprobados; DNI/CUIT, coordenadas y datos internos no se renderizan.

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

### `Review_request_button`

- **Ubicación:** `src/features/reviews/components/review_request_button.tsx`.
- **Entorno e interfaz:** Client Component; recibe `oferente_id: number` desde el perfil público validado.
- **Objetivo:** Mostrar “Calificar”, validar los datos del cliente, crear la solicitud real y confirmar el envío por correo u ofrecer el enlace de WhatsApp resultante.
- **Estados/dependencias:** Cerrado, formulario, enviando, error y enlace generado; API de reseñas, componentes UI, Sonner y Huge Icons.
- **Personalización:** Textos y distribución visual. Las reglas de contacto y el vínculo entre `id_usuario` e `id_oferente` pertenecen al contrato del backend.
- **Accesibilidad:** Labels visibles, ayuda y errores propios asociados mediante ARIA, foco de error visible, estado deshabilitado durante el envío y enlaces identificados por texto. El formulario usa `noValidate` para reemplazar los mensajes genéricos del navegador por textos específicos en español.

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

### `Validar_matricula_page`

- **Ubicación:** `src/app/validar-matricula/page.tsx`.
- **Entorno e interfaz:** Server Component dinámico sin props.
- **Objetivo:** Proteger el acceso a la validación de matrícula: exige sesión activa (`access_token`), rol `Oferente`, y verifica que no posea ya una matrícula activa en `/oferentes/me/matriculas` (en cuyo caso redirige al inicio). Renderiza el contenedor de la tarjeta de validación con `License_validation_form`.
- **Estados/dependencias:** Redirección no autenticada (`/login`), redirección no oferente o ya validado (`/`), presentación con `License_validation_form`, `Image`, `Link` y Huge Icons.
- **Personalización:** Presentación, textos y encabezado.

### `License_validation_form`

- **Ubicación:** `src/app/validar-matricula/components/license_validation_form.tsx`.
- **Entorno e interfaz:** Client Component sin props.
- **Objetivo:** Gestionar el formulario de validación de matrícula según las reglas del padrón: selector de oficio (`Aire acondicionado` con 8 dígitos o `Gasista` con 10 dígitos), input numérico con conteo de dígitos en vivo, bloqueo del botón hasta cumplir la longitud exacta, envío seguro al Route Handler `/api/matriculas/validar`, feedback con toasts de Sonner (3s para éxito, 5s para errores) y refresco/redirección automática tras validar.
- **Estados/dependencias:** Tipo de oficio, número ingresado, estado enviando/cargando (`is_submitting`), toasts de Sonner, `useRouter`, `Input`, `Label`, `Button` y Huge Icons.
- **Accesibilidad:** Labels asociados, atributos `inputMode="numeric"`, `maxLength`, `aria-busy`, `aria-describedby` y botón deshabilitado durante peticiones.

## Componentes shadcn/ui importados

| Componente | Ruta | Uso | Documentación |
| --- | --- | --- | --- |
| `Button` | `src/components/ui/button.tsx` | Confirmación y acciones | [Button](https://ui.shadcn.com/docs/components/button) |
| `Card` | `src/components/ui/card.tsx` | Datos, estados y resumen | [Card](https://ui.shadcn.com/docs/components/card) |
| `Input` | `src/components/ui/input.tsx` | Datos precargados y formulario de matrícula | [Input](https://ui.shadcn.com/docs/components/input) |
| `Label` | `src/components/ui/label.tsx` | Etiquetas de formulario | [Label](https://ui.shadcn.com/docs/components/label) |
| `Textarea` | `src/components/ui/textarea.tsx` | Comentario opcional | [Textarea](https://ui.shadcn.com/docs/components/textarea) |
| `Toaster` | `src/components/ui/sonner.tsx` | Errores de 5 s y éxitos de 3 s | [Sonner](https://ui.shadcn.com/docs/components/sonner) |

## Integraciones

| Integración | Estado |
| --- | --- |
| FastAPI | Activa mediante `NEXT_PUBLIC_API_URL` |
| Perfiles profesionales | Listado y detalle públicos en `/oferentes` y `/oferentes/[id]` |
| Validación de matrícula | Activa en `/validar-matricula` mediante `/api/matriculas/validar` contra `/oferentes/me/matriculas/validaciones` (HU-02) |
| Solicitud de reseña | Se genera desde “Calificar” en un perfil real; Swagger continúa disponible para QA |
| Formulario público | Implementado en `/resena/[code]`, sin login |
| Moderación | Activa desde la campana autenticada; aceptar publica y recalcula, rechazar no publica ni suma al promedio |
| Auth0/Google | Integración de `main` preservada |
| PostgreSQL/Supabase | Sólo backend; sin conexión frontend |
| Email/WhatsApp | Backend genera/envía; el frontend sólo consume el enlace recibido |

## Mantenimiento

Actualizá este archivo cuando cambie una ruta, componente, integración o límite de renderizado. Actualizá también `README.md` cuando cambien configuración, comandos, puertos o pasos de QA.
