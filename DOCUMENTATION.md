# Documentación del frontend de OFFIX

## Alcance del documento

Este documento describe la arquitectura prevista para el frontend y los componentes que existen actualmente en el repositorio. Diferencia el comportamiento implementado de la arquitectura aprobada a futuro para no dar a entender que funcionalidades incompletas ya están disponibles.

El código de la aplicación está ubicado en `offix-frontend/`.

## Arquitectura

### Capa de frontend

- **Tecnologías:** Next.js, React, TypeScript, Tailwind CSS y shadcn/ui.
- **Ubicación:** `offix-frontend/`.
- **Responsabilidades:** Renderizar una interfaz responsiva, realizar las validaciones aprobadas del lado del cliente, comunicarse con el backend mediante HTTP, subir archivos a través del flujo aprobado y administrado por el backend, y mostrar imágenes aprobadas desde la CDN de Cloudflare.
- **Renderizado:** Utiliza App Router de Next.js y prioriza Server Components. Se puede utilizar SSR cuando mejore el rendimiento y la navegación. Los Client Components quedan reservados para APIs del navegador, estado interactivo, efectos y manejadores de eventos.
- **Estado actual:** El repositorio contiene la estructura inicial de App Router. shadcn/ui está inicializado con Base UI y contiene el componente `Button`. Se han configurado la integración inicial con la API (autenticación), las notificaciones globales mediante Sonner y la tipografía Montserrat. Los demás flujos funcionales del producto continúan en desarrollo.

### Capa de backend

- **Tecnología:** Python con FastAPI, alojado en Render.
- **Responsabilidades:** Administrar la lógica de negocio, autenticación, autorización, validaciones del servidor, endpoints REST, operaciones de base de datos y la validación y confirmación de la subida de imágenes.
- **Límite con el frontend:** El frontend debe utilizar contratos HTTP documentados y no debe inferir endpoints ni estructuras de respuesta.

### Capa de persistencia

- **Tecnología:** PostgreSQL mediante Supabase.
- **Responsabilidades:** Almacenar usuarios, perfiles profesionales, publicaciones de necesidades de servicios, historial de interacciones, reseñas y demás datos estructurados y textos aprobados.
- **Límite con el frontend:** El navegador y el frontend de Next.js no deben conectarse directamente con PostgreSQL ni recibir credenciales de la base de datos. Todo acceso a los datos debe pasar por FastAPI.

### Capa de almacenamiento de imágenes

- **Tecnología:** Almacenamiento y distribución mediante la CDN de Cloudflare.
- **Responsabilidades:** Almacenar las imágenes de usuarios por separado de PostgreSQL y servir recursos optimizados.
- **Flujo de datos:** El backend valida y confirma las subidas. El frontend consume directamente las URLs aprobadas de la CDN. La secuencia exacta de autorización, subida y confirmación todavía no está definida y debe consultarse antes de implementarla.

### Flujo de datos previsto

```text
Navegador / Interfaz de Next.js
              |
              | Solicitudes HTTP y flujo aprobado de subida
              v
      FastAPI en Render
              |
              +---- datos estructurados ----> PostgreSQL en Supabase
              |
              +---- valida y confirma ------> Almacenamiento de Cloudflare

Navegador / Interfaz de Next.js ---- entrega de imágenes aprobadas ----> CDN de Cloudflare
```

## Estructura del repositorio

```text
FRONTEND/
├── AGENTS.md
├── DOCUMENTATION.md
├── README.md
├── requirements.txt
└── offix-frontend/
    ├── components.json
    ├── public/
    ├── src/
    │   ├── app/
    │   │   ├── globals.css
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── components/
    │   │   └── ui/
    │   │       └── button.tsx
    │   └── lib/
    │       └── utils.ts
    ├── next.config.ts
    ├── package.json
    └── pnpm-lock.yaml
```

Agregá directorios únicamente cuando una funcionalidad implementada genere una necesidad concreta. Si cambia la arquitectura, actualizá esta sección en el mismo cambio.

## Sistema de diseño

### Colores aprobados

| Uso semántico | Valor hexadecimal | Observaciones |
| --- | --- | --- |
| Superficie de componentes | `#6E8898` | Botones y otras superficies de componentes aprobadas |
| Hover de componentes | `#9FB1BC` | Provisorio hasta que desarrollo confirme su uso definitivo |
| Fondo general | `#BABCCA` | Fondo principal de la aplicación |
| Texto de headers y menús | `#BABCCA` | Texto ubicado sobre headers o menús desplegables oscuros |
| Superficie de headers y menús | `#231942` | Fondo de headers y menús desplegables |
| Texto general | `#231942` | Texto ubicado sobre el fondo general |

Los valores de marca deben exponerse como variables semánticas de CSS o del tema de Tailwind antes de utilizarlos ampliamente. Los colores adicionales, incluidos los de error, advertencia, éxito, foco y estado deshabilitado, requieren aprobación.

### Tipografía

- **Headers y títulos:** Montserrat, peso `800`.
- **Cuerpo, párrafos y footers:** Raleway, peso `400`.
- **Estrategia de carga:** `next/font/google`; no deben utilizarse imports de hojas de estilo remotas ni archivos `.ttf` o `.otf` innecesarios.
- **Estado actual:** `RootLayout` declara Montserrat y Geist, pero actualmente aplica Geist mediante `--font-sans`. Raleway y la asignación aprobada de Montserrat `800` para títulos y Raleway `400` para cuerpo todavía no están implementadas.

### Tema

No existe una paleta aprobada para el modo oscuro. La inicialización de shadcn/ui agregó variables neutrales y una clase `.dark`; esos valores predeterminados todavía no representan la paleta aprobada de OFFIX y no deben considerarse el tema final del producto.

## Catálogo de componentes propios

### `RootLayout`

- **Ubicación:** `offix-frontend/src/app/layout.tsx`.
- **Objetivo:** Define la estructura HTML raíz requerida por App Router, los metadatos globales, la importación del CSS global, el idioma del documento y las fuentes globales.
- **Entorno de renderizado:** Server Component.
- **Interfaz:** Recibe la propiedad requerida `children: React.ReactNode` desde Next.js.
- **Comportamiento actual:** Renderiza `<html lang="es">` y el cuerpo de la aplicación. Aplica Geist como `font-sans`; Montserrat está declarada pero no aplicada. Los metadatos todavía contienen textos genéricos provisorios.
- **Dependencias:** `next`, `next/font/google`, tipos de React, `@/lib/utils` y `globals.css`.
- **Cómo personalizarlo:**
  - Modificá los metadatos globales en el objeto exportado `metadata` una vez que los textos del producto estén aprobados.
  - Configurá las fuentes globales aprobadas en las declaraciones de `next/font/google`.
  - Aplicá las variables generadas para las fuentes sobre `<html>` o `<body>`.
  - Agregá proveedores globales solamente cuando la funcionalidad y sus dependencias estén aprobadas.
  - Conservá los elementos obligatorios `<html>` y `<body>`.

### `Home`

- **Ubicación:** `offix-frontend/src/app/page.tsx`.
- **Objetivo:** Define el punto de entrada de la ruta `/`.
- **Entorno de renderizado:** Server Component.
- **Interfaz:** No recibe propiedades.
- **Comportamiento actual:** Renderiza el estado de autenticación. Si el usuario no está autenticado, muestra un mensaje y un enlace hacia el login. Si está autenticado, muestra la cabecera con el botón de "Cerrar sesión" y la tarjeta de perfil con sus datos (nombre y email).
- **Dependencias:** App Router de Next.js.
- **Cómo personalizarlo:**
  - Implementá el dashboard principal para usuarios logueados aquí.
  - El estado de no autenticado debería reemplazarse por el landing público o redirigir al login según el flujo.

### `LoginForm`

- **Ubicación:** `offix-frontend/src/app/(auth)/login/login_form.tsx`
- **Objetivo:** Renderizar el botón de inicio de sesión de Google y gestionar el flujo de autenticación (incluyendo modo mock).
- **Entorno de renderizado:** Client Component.
- **Interfaz:** No recibe propiedades.
- **Dependencias:** Ninguna externa.
- **Cómo personalizarlo:** Cambiar el ícono o el texto del botón.



### `ErrorHandler`

- **Ubicación:** `offix-frontend/src/app/(auth)/login/error_handler.tsx`
- **Objetivo:** Capturar los parámetros de error en la URL (retornados por el backend) y mostrar un toast al usuario.
- **Entorno de renderizado:** Client Component (envuelto en Suspense).
- **Interfaz:** No recibe propiedades.
- **Dependencias:** `next/navigation` (`useSearchParams`), `sonner`.
- **Cómo personalizarlo:** Modificar el mensaje del toast o la duración en base al código de error.

## Registro de componentes de shadcn/ui

### `Button`

- **Ruta local:** `offix-frontend/src/components/ui/button.tsx`.
- **Objetivo dentro de OFFIX:** Proveer el componente base para acciones. Todavía no está utilizado por una pantalla funcional.
- **Base:** Primitiva `Button` de `@base-ui/react`.
- **Variantes disponibles:** `default`, `outline`, `secondary`, `ghost`, `destructive` y `link`.
- **Tamaños disponibles:** `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm` e `icon-lg`.
- **Personalización:** Modificá las variantes y tamaños en `buttonVariants`. Los colores provienen de las variables semánticas definidas en `globals.css`; antes de usarlo en producto, esas variables deben alinearse con la paleta aprobada de OFFIX.
- **Documentación oficial:** [Button de shadcn/ui](https://ui.shadcn.com/docs/components/button).

Cuando se agregue otro componente, documentalo con esta estructura:

```markdown
### Nombre del componente

- **Ruta local:** `offix-frontend/...`
- **Objetivo dentro de OFFIX:** Explicá el flujo aprobado que lo utiliza.
- **Personalización:** Registrá las variantes locales, variables del tema y cambios de comportamiento.
- **Documentación oficial:** Incluí el enlace exacto del componente en https://ui.shadcn.com/docs/components.
```

Sonner está aprobado y agregado al proyecto para notificaciones tipo toast, renderizado en el layout raíz mediante `<Toaster />`.

## Plantilla para documentar componentes propios

Usá esta estructura para cada componente nuevo:

```markdown
### `Component_identifier`

- **Ubicación:** `offix-frontend/...`
- **Objetivo:** Una responsabilidad breve y concreta.
- **Entorno de renderizado:** Server Component o Client Component, incluida la razón para utilizar renderizado del cliente.
- **Interfaz:** Props, callbacks emitidos y tipos relevantes.
- **Estados y variantes:** Carga, vacío, éxito, error, deshabilitado, responsivo y variantes visuales aprobadas.
- **Dependencias:** Componentes del proyecto y componentes externos aprobados.
- **Cómo personalizarlo:** Contenido, apariencia, comportamiento y restricciones, indicando archivos o props concretos.
- **Accesibilidad:** Labels, semántica, foco, comportamiento del teclado y anuncios, cuando corresponda.
```

## Estado de las integraciones

| Integración | Responsable previsto | Estado actual del frontend |
| --- | --- | --- |
| API REST de FastAPI en Render | Backend | Contrato y URL base sin configurar |
| PostgreSQL mediante Supabase | Solamente backend | Sin conexión directa desde el frontend, según lo requerido |
| Entrega de imágenes de Cloudflare | Frontend para lecturas aprobadas de la CDN | Host y reglas de entrega sin configurar |
| Confirmación de subidas a Cloudflare | Backend | Protocolo sin definir |
| Contacto mediante WhatsApp | Enlace del frontend con datos aprobados del perfil | Sin implementar |
| Notificaciones por correo electrónico | Backend o servicio externo | Disparadores y plantillas sin definir |
| shadcn/ui | Frontend | Inicializado con Base UI; `Button` agregado localmente |
| Sonner | Frontend | Agregado y configurado en `RootLayout` |
| Autenticación | Backend / Frontend | Integrado mediante API REST de FastAPI con JWT y cookies |

## Requisitos pendientes de definición

La implementación debe detenerse y consultar a desarrollo cuando dependa de:

- La identidad y los permisos de clientes.
- Las reglas de búsqueda, comparación, ubicación, publicación de necesidades de servicio y contratación.
- Los límites de validación de cada campo.
- Las restricciones de adjuntos y el protocolo de subida.
- El flujo de verificación de matrículas profesionales.
- Los estados de reseñas, reglas de calificación y comportamiento de moderación.
- Los endpoints de la API, contratos de datos y transporte de autenticación.
- El comportamiento final del hover y los colores faltantes para estados semánticos.

## Mantenimiento de la documentación

- Actualizá este archivo cuando cambie un componente propio, un componente de shadcn/ui, una integración, un límite de renderizado, un flujo de datos o la estructura del proyecto.
- Actualizá `README.md` cuando cambien la instalación, configuración de ambiente, comandos, puertos o procedimientos de QA.
- Verificá que ambos documentos sigan siendo consistentes cada vez que modifiques alguno.
- Describí el comportamiento actual con precisión e identificá el comportamiento planificado como previsto o no implementado.
