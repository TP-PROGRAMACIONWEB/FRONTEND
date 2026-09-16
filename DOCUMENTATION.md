# Documentación del frontend de OFFIX

## Alcance

Este documento describe la arquitectura y los componentes mantenidos actualmente. La aplicación de Next.js está en `offix-frontend/`.

El único flujo funcional implementado es un prototipo visual y temporal de reseñas. No existe integración de reseñas con backend, autenticación, generación de enlaces, mensajería, notificaciones a profesionales ni moderación.

## Arquitectura

### Aplicación y límites

- **Stack:** Next.js App Router, React, TypeScript estricto, Tailwind CSS, shadcn/ui, Sonner y el rating gratuito de ReUI.
- **Renderizado:** Los layouts y las páginas de ruta son Server Components. El estado, los formularios, el diálogo y el rating son Client Components porque usan eventos, navegación y estado de React.
- **Backend previsto:** FastAPI en Render conserva la responsabilidad futura sobre negocio, autenticación, autorización, validación, PostgreSQL de Supabase y confirmación de subidas a Cloudflare.
- **Límite actual:** El frontend no conoce endpoints, credenciales, sesiones ni contratos de API. Tampoco se conecta directamente a PostgreSQL ni a Cloudflare.

### Prototipo temporal de reseñas

Las rutas `/review-test` y `/form-review-test` comparten `src/app/(review_test)/layout.tsx`. Ese layout monta `Review_test_provider`, por lo que el teléfono, el correo, las cuatro puntuaciones, la descripción, el indicador de reapertura y el estado de envío sobreviven solamente a la navegación cliente entre ambas rutas.

```text
/review-test
    |
    | datos válidos en el diálogo
    v
/form-review-test ---- Confirmar ----> tarjeta enviada en la misma ruta
    |
    | Volver
    v
/review-test con el diálogo reabierto
```

No se usan query parameters, `localStorage`, `sessionStorage`, cookies ni una biblioteca de estado global. Una recarga elimina el contexto. El acceso directo a `/form-review-test` muestra una salida segura para regresar.

Los valores iniciales y la configuración visual de categorías están aislados en `src/features/reviews/data/review_test_mock.ts`. Las validaciones y el mapeo cualitativo son funciones puras dentro de `src/features/reviews/lib/`.

### Estructura relevante

```text
offix-frontend/src/
├── app/
│   ├── (review_test)/
│   │   ├── form-review-test/page.tsx
│   │   ├── review-test/page.tsx
│   │   └── layout.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── reui/rating.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── sonner.tsx
│       └── textarea.tsx
└── features/reviews/
    ├── components/
    ├── context/review_test_context.tsx
    ├── data/review_test_mock.ts
    ├── lib/
    └── types/review.ts
```

## Sistema de diseño

`src/app/globals.css` centraliza la paleta mediante tokens semánticos. No hay modo oscuro.

| Token o uso | Valor |
| --- | --- |
| Componentes principales | `#6E8898` |
| Hover y superficie secundaria | `#9FB1BC` |
| Fondo general | `#BABCCA` |
| Superficie fuerte y texto general | `#231942` |
| Texto sobre superficie fuerte | `#BABCCA` |

Los blancos, grises, color de error, foco y rating son neutrales o estados semánticos centralizados en el mismo archivo. Como norma, los botones de acción usan texto `#BABCCA` sobre `#231942`. Las acciones de cancelar o cerrar conservan sus variantes discretas y las acciones de eliminar conservan la variante destructiva.

`RootLayout` carga Montserrat `600` y `800`, además de Raleway `400`, con `next/font/google`. `font-heading` usa Montserrat; los botones usan Montserrat `600`, los títulos Montserrat `800` y el resto de los controles Raleway.

## Catálogo de componentes propios

### `RootLayout`

- **Ubicación:** `offix-frontend/src/app/layout.tsx`.
- **Objetivo:** Define HTML en español, metadatos de OFFIX, CSS global y fuentes.
- **Entorno:** Server Component.
- **Interfaz:** `children: React.ReactNode`.
- **Estados/variantes:** No tiene estado interactivo.
- **Dependencias:** `next`, `next/font/google` y `globals.css`.
- **Personalización:** Metadatos en `metadata`; pesos y subconjuntos en las declaraciones de fuentes; asignación visual en `globals.css`.

### `Home`

- **Ubicación:** `offix-frontend/src/app/page.tsx`.
- **Objetivo:** Reserva la ruta `/` sin inventar contenido de producto.
- **Entorno:** Server Component.
- **Interfaz:** Sin props.
- **Estados/variantes:** Renderiza `null`.
- **Dependencias:** App Router.
- **Personalización:** Implementar solamente cuando exista un diseño aprobado para la portada.

### `Review_test_layout`

- **Ubicación:** `offix-frontend/src/app/(review_test)/layout.tsx`.
- **Objetivo:** Comparte el contexto temporal entre las dos rutas de prueba.
- **Entorno:** Server Component que compone un proveedor cliente.
- **Interfaz:** `children: ReactNode`.
- **Estados/variantes:** No agrega persistencia fuera de la memoria del árbol React.
- **Dependencias:** `Review_test_provider`.
- **Personalización:** El límite del route group define qué rutas comparten el prototipo.

### `Review_test_page` y `Form_review_test_page`

- **Ubicación:** `offix-frontend/src/app/(review_test)/review-test/page.tsx` y `offix-frontend/src/app/(review_test)/form-review-test/page.tsx`.
- **Objetivo:** Exponen las rutas temporales y delegan su presentación a `Review_entry` y `Review_form`.
- **Entorno:** Server Components.
- **Interfaz:** Sin props.
- **Estados/variantes:** Heredan los estados de sus componentes cliente.
- **Dependencias:** App Router y los componentes de la feature.
- **Personalización:** Mantener las rutas delgadas; los cambios del flujo pertenecen a `src/features/reviews/`.

### `Review_test_provider`

- **Ubicación:** `offix-frontend/src/features/reviews/context/review_test_context.tsx`.
- **Objetivo:** Es la única fuente de estado temporal del prototipo.
- **Entorno:** Client Component por `useState` y `useContext`.
- **Interfaz:** `children: ReactNode`; el hook `useReview_test` expone datos y acciones tipadas.
- **Estados/variantes:** Contacto, cuatro ratings, descripción, reapertura del diálogo y confirmación.
- **Dependencias:** React, tipos de reseña y `initial_review_test_state`.
- **Personalización:** Valores iniciales en `review_test_mock.ts`; no agregar persistencia ni llamadas HTTP dentro del proveedor.

### `Review_entry`

- **Ubicación:** `offix-frontend/src/features/reviews/components/review_entry.tsx`.
- **Objetivo:** Muestra el único botón `Calificar` y controla la apertura del diálogo.
- **Entorno:** Client Component por el estado abierto/cerrado.
- **Interfaz:** Sin props.
- **Estados/variantes:** Cerrado, abierto y reapertura solicitada desde el formulario de reseña.
- **Dependencias:** `Button`, `Client_data_dialog` y el contexto.
- **Personalización:** Espaciado y proporciones en las clases del `main` y del botón.

### `Client_data_dialog`

- **Ubicación:** `offix-frontend/src/features/reviews/components/client_data_dialog.tsx`.
- **Objetivo:** Captura y valida teléfono/correo antes de navegar al formulario.
- **Entorno:** Client Component por formulario, Sonner, contexto y `useRouter`.
- **Interfaz:** `on_open_change(open: boolean)`.
- **Estados/variantes:** Vacío, error por campo, toast de contacto ausente, navegación deshabilitada y contacto válido.
- **Dependencias:** `Dialog`, `Input`, `Label`, `Button`, `Toaster`, Sonner y helpers de validación.
- **Personalización:** Mensajes/reglas en `review_validation.ts`; ancho y espacios en el componente. El teléfono explicita que elimina espacios, `+`, guiones y paréntesis.
- **Accesibilidad:** Labels visibles, `aria-invalid`, feedback asociado, foco modal y cierre por teclado provistos por Base UI.

### `Review_form`

- **Ubicación:** `offix-frontend/src/features/reviews/components/review_form.tsx`.
- **Objetivo:** Orquesta contacto de solo lectura, ratings, promedio, descripción y acciones.
- **Entorno:** Client Component por contexto, eventos y navegación.
- **Interfaz:** Sin props; consume `useReview_test`.
- **Estados/variantes:** Datos faltantes, formulario editable, descripción de 0 a 200 caracteres y reseña enviada.
- **Dependencias:** Componentes UI, `Review_rating_field`, `Submitted_review_card`, configuración y helpers tipados.
- **Personalización:** `description_limit`, grillas responsive y textos locales. El promedio siempre se deriva; no se guarda. Los datos de contacto deshabilitados conservan el texto morado con opacidad completa.
- **Accesibilidad:** Secciones con headings, inputs deshabilitados, contador asociado y controles nativos del formulario.

### `Review_rating_field`

- **Ubicación:** `offix-frontend/src/features/reviews/components/review_rating_field.tsx`.
- **Objetivo:** Presenta una categoría, su ayuda, valor, estrellas y etiqueta cualitativa.
- **Entorno:** Client Component por el callback del rating.
- **Interfaz:** `description`, `label`, `rating` y `on_change`.
- **Estados/variantes:** Valores de `0.5` a `5`, paso `0.5`, con las cinco etiquetas centralizadas.
- **Dependencias:** `Rating` de ReUI y `get_rating_label`.
- **Personalización:** Contenido desde `rating_categories`; apariencia en el contenedor y tokens del rating.
- **Accesibilidad:** Nombre accesible por categoría, valor actual y ayuda asociada; flechas del teclado modifican medio punto.

### `Submitted_review_card`

- **Ubicación:** `offix-frontend/src/features/reviews/components/submitted_review_card.tsx`.
- **Objetivo:** Resume el contacto disponible, promedio, desglose y descripción enviada.
- **Entorno:** Client Component porque consume el contexto.
- **Interfaz:** Sin props.
- **Estados/variantes:** Omite contactos no provistos y muestra `No se agregó una descripción.` cuando corresponde.
- **Dependencias:** `Card`, contexto, categorías y helpers de rating.
- **Personalización:** `summary_columns` fija Puntualidad/Calidad a la izquierda y Precio/Atención a la derecha; debajo de `sm` se apilan.
- **Accesibilidad:** Usa listas de definición y conserva un orden de lectura estable.

## Componentes shadcn/ui

| Componente | Ruta local | Uso en OFFIX | Personalización | Documentación |
| --- | --- | --- | --- | --- |
| `Button` | `src/components/ui/button.tsx` | Acciones del flujo | Montserrat `600`; acción normal `#BABCCA` sobre `#231942`; cancelar/cerrar con `outline` o `ghost`; eliminar con `destructive` | [Button](https://ui.shadcn.com/docs/components/button) |
| `Card` | `src/components/ui/card.tsx` | Estado faltante y resumen enviado | Superficie mediante tokens y espaciado `--card-spacing` | [Card](https://ui.shadcn.com/docs/components/card) |
| `Dialog` | `src/components/ui/dialog.tsx` | Datos del cliente | Ancho en el consumidor; foco, portal y cierre desde Base UI | [Dialog](https://ui.shadcn.com/docs/components/dialog) |
| `Input` | `src/components/ui/input.tsx` | Contacto editable y contacto deshabilitado | Estados de foco, error y disabled por tokens | [Input](https://ui.shadcn.com/docs/components/input) |
| `Label` | `src/components/ui/label.tsx` | Etiquetas visibles | Tipografía y estados peer-disabled | [Label](https://ui.shadcn.com/docs/components/label) |
| `Textarea` | `src/components/ui/textarea.tsx` | Descripción opcional | Altura y resize en `Review_form` | [Textarea](https://ui.shadcn.com/docs/components/textarea) |
| `Toaster` | `src/components/ui/sonner.tsx` | Feedback transitorio | Tema claro fijo, íconos locales y helpers que fijan errores en 5 segundos y éxitos en 3 segundos | [Sonner](https://ui.shadcn.com/docs/components/sonner) |

## Componente ReUI

### `Rating`

- **Ruta local:** `offix-frontend/src/components/reui/rating.tsx`.
- **Objetivo:** Control visual de cinco estrellas para cada categoría.
- **Fuente:** [ReUI Rating 9](https://reui.io/components/rating/c-rating-9).
- **Adaptación local:** El componente generado fue convertido en un `input type="range"` transparente sobre las estrellas, con `min=0.5`, `max=5` y `step=0.5`. Esto agrega medias estrellas, control por teclado, nombre accesible, valor accesible y foco visible sin otra dependencia.
- **Interfaz:** `rating`, `aria_label`, `aria_describedby`, `editable`, `max_rating`, `on_rating_change`, `size`, `show_value` y clases opcionales.
- **Personalización:** Tamaños en `ratingVariants`/`starVariants`; color mediante `--rating`; granularidad mediante los atributos del range.

## Estado de integraciones

| Integración | Estado actual |
| --- | --- |
| API REST de FastAPI | Sin URL ni contrato configurado |
| PostgreSQL/Supabase | Sin conexión directa desde frontend |
| Cloudflare | Host y protocolo sin configurar |
| Autenticación | Sin implementar |
| WhatsApp, email y notificaciones profesionales | Sin implementar |
| Flujo productivo de reseñas | Sin implementar; solo prototipo en memoria |
| shadcn/ui | Componentes requeridos agregados localmente |
| ReUI | `Rating` agregado y adaptado localmente |
| Sonner | Configurado para el error del diálogo temporal; duraciones centralizadas para errores y éxitos |

## Mantenimiento

- Actualizá este archivo cuando cambie un componente, integración, límite de renderizado, flujo de datos o estructura.
- Actualizá `README.md` cuando cambien instalación, configuración, comandos, puertos o verificación de QA.
- No documentes una integración prevista como implementada.
