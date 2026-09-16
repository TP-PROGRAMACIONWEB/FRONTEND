# Frontend de OFFIX

OFFIX es una plataforma web pensada para conectar clientes de una localidad con profesionales de distintos oficios. Este repositorio contiene la aplicación frontend inicial.

Este README es una guía operativa para QA y demás colaboradores técnicos que necesiten instalar, configurar, ejecutar o verificar la aplicación sin modificar código. La arquitectura y los componentes se encuentran en [DOCUMENTATION.md](./DOCUMENTATION.md), mientras que las reglas de implementación están definidas en [AGENTS.md](./AGENTS.md).

## Ubicación del proyecto

La aplicación de Next.js está ubicada en:

```text
offix-frontend/
```

Ejecutá los comandos del frontend desde esa carpeta.

## Requisitos previos

- Node.js 24 LTS recomendado. Next.js requiere Node.js `20.9` o posterior.
- pnpm `12.4.1`, de acuerdo con el campo `packageManager` de `package.json`.
- Git.

Verificá que las herramientas estén instaladas:

```bash
node --version
pnpm --version
git --version
```

Si usás Windows, tenés Node.js 24 instalado y todavía no contás con pnpm:

```powershell
npm install --global pnpm@12.4.1
```

No uses npm, Yarn ni Bun para instalar las dependencias del proyecto.

## Dependencias actuales del frontend

El proyecto ya declara sus dependencias en `offix-frontend/package.json`.

### Dependencias de ejecución

- `next`: framework de la aplicación.
- `react`: biblioteca para construir la interfaz.
- `react-dom`: integración de React con el navegador y el renderizado de Next.js.
- `@base-ui/react`: primitivas accesibles utilizadas por los componentes de shadcn/ui seleccionados.
- `class-variance-authority`: definición de variantes de componentes.
- `cn`: composición de nombres de clases.
- `lucide-react`: biblioteca de íconos configurada por shadcn/ui.
- `shadcn` y `tw-animate-css`: estilos y utilidades requeridos por la configuración actual de shadcn/ui.

### Dependencias de desarrollo

- `typescript`: tipado estático.
- `tailwindcss` y `@tailwindcss/postcss`: estilos y procesamiento de CSS.
- `eslint` y `eslint-config-next`: análisis estático del código.
- `@types/node`, `@types/react` y `@types/react-dom`: definiciones de tipos.

shadcn/ui ya está inicializado con Base UI y el componente `Button` está disponible localmente. Sonner forma parte del stack aprobado, pero todavía no está agregado.

## Agregar y usar componentes de shadcn/ui

shadcn/ui no funciona como una biblioteca tradicional desde la que se importan todos los componentes. Su CLI copia el código fuente de cada componente dentro del proyecto, normalmente en `src/components/ui/`. Esto permite revisar y personalizar el componente localmente.

### Inicializar shadcn/ui en el proyecto existente

Este paso ya fue realizado en OFFIX y no debe repetirse mientras exista `offix-frontend/components.json`. En otro checkout donde todavía no esté inicializado, se realiza una sola vez desde la raíz del repositorio:

```bash
cd offix-frontend
pnpm dlx shadcn@latest init
```

Ejecutá `init` desde `offix-frontend/`. No uses una opción de creación de proyecto, como `--template`, ni indiques un nombre nuevo, porque eso generaría otra aplicación Next.js en lugar de configurar OFFIX.

Antes de aceptar cambios de tema, colores o dependencias sugeridos por el asistente de configuración, comprobá que respeten el sistema de diseño y las reglas de `AGENTS.md`.

### Agregar un componente mediante la terminal

La CLI es la opción recomendada porque copia el componente, instala solamente sus dependencias requeridas y respeta las rutas configuradas en `components.json`.

El componente `Button` ya está agregado. Este es el comando que se utilizaría para recuperarlo o agregarlo en otro checkout inicializado:

```bash
pnpm dlx shadcn@latest add button
```

Ejemplos de componentes que todavía pueden agregarse cuando una funcionalidad aprobada los necesite:

```bash
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add sonner
```

Agregá únicamente los componentes necesarios para una funcionalidad aprobada. No instales todos los componentes de manera preventiva.

### Importar el componente en el código

Después de agregarlo, sí podés importarlo normalmente. El import apunta al archivo local generado:

```tsx
import { Button } from "@/components/ui/button";

export function Example_button() {
  return <Button>Guardar</Button>;
}
```

No utilices este import:

```tsx
import { Button } from "shadcn/ui";
```

Ese paquete no funciona como un catálogo de componentes de ejecución. Los componentes pasan a formar parte del código fuente de OFFIX.

Para Sonner, primero agregá el componente con la CLI y luego importá el `Toaster` local en el layout:

```tsx
import { Toaster } from "@/components/ui/sonner";
```

Los mensajes se disparan desde un Client Component mediante la dependencia `sonner` que instala el componente:

```tsx
import { toast } from "sonner";

toast.success("Los cambios se guardaron correctamente");
```

### Instalación manual

No es obligatorio usar la consola para copiar un componente. También podés seguir la opción **Manual** de la documentación oficial, crear el archivo dentro de `src/components/ui/`, copiar su código e instalar cada dependencia requerida.

La instalación manual es más propensa a dejar dependencias, imports o variables CSS sin configurar. Por eso, en OFFIX se recomienda utilizar la CLI y revisar el código generado antes de confirmarlo.

Consultá la [instalación oficial para Next.js](https://ui.shadcn.com/docs/installation/next) y el [catálogo oficial de componentes](https://ui.shadcn.com/docs/components).

## Instalar las dependencias

No es necesario instalar cada paquete por separado. Desde la raíz del repositorio ejecutá:

```bash
cd offix-frontend
pnpm install
```

`pnpm install` lee `package.json`, instala tanto las dependencias de ejecución como las de desarrollo y utiliza las versiones bloqueadas en `pnpm-lock.yaml`.

Para QA, integración continua o una instalación que deba respetar el archivo de bloqueo sin modificarlo, usá:

```bash
cd offix-frontend
pnpm install --frozen-lockfile
```

Al terminar, verificá la instalación:

```bash
pnpm lint
pnpm dev
```

Las fuentes de verdad para las dependencias son `offix-frontend/package.json` y `offix-frontend/pnpm-lock.yaml`. `requirements.txt` pertenece al ecosistema de Python y no puede instalar paquetes de Next.js; en este repositorio funciona únicamente como una aclaración para evitar ejecutar `pip install` por error.

## Configurar las variables de entorno

Actualmente, la aplicación utiliza variables de entorno (por ejemplo, `NEXT_PUBLIC_API_URL` para la integración con el backend).

Para gestionar la configuración:

1. Los nombres de las variables requeridas deberán agregarse a un archivo `.env.example` versionado, con valores vacíos o ejemplos seguros.
2. Los valores locales deberán guardarse en `offix-frontend/.env.local`.
3. Los valores secretos no deberán usar el prefijo `NEXT_PUBLIC_`, porque ese prefijo los expone al navegador.
4. Las URLs reales, credenciales y tokens nunca deberán subirse al repositorio.

Pedile al equipo de desarrollo los valores aprobados para cada ambiente. No inventes endpoints ni reutilices secretos de producción en ambientes locales o de QA.

## Levantar la aplicación en desarrollo

```bash
cd offix-frontend
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000).

El servidor de desarrollo recarga la página cuando cambia el código fuente. Para detenerlo, presioná `Ctrl+C`.

## Comandos disponibles

Ejecutá estos comandos desde `offix-frontend/`:

| Comando | Para qué sirve |
| --- | --- |
| `pnpm dev` | Levanta el servidor local de desarrollo |
| `pnpm lint` | Ejecuta las verificaciones de ESLint |
| `pnpm build` | Genera y valida una compilación de producción |
| `pnpm start` | Sirve una compilación de producción existente |

## Probar localmente la versión de producción

Usá esta secuencia:

```bash
cd offix-frontend
pnpm build
pnpm start
```

Abrí [http://localhost:3000](http://localhost:3000). Para detener el servidor, presioná `Ctrl+C`.

## Verificación rápida para QA

Antes de comenzar las pruebas funcionales:

1. Ejecutá `pnpm install --frozen-lockfile`.
2. Ejecutá `pnpm lint`.
3. Ejecutá `pnpm build`.
4. Levantá el servidor correspondiente.
5. Confirmá que la terminal muestre la URL local esperada y que no existan errores de compilación.

Actualmente, la ruta principal no contiene una interfaz visible del producto. Sin embargo, ya se ha configurado la integración inicial con el backend para los flujos de autenticación, la tipografía (Montserrat) y las notificaciones con Sonner. El resto de los flujos funcionales continúan en desarrollo.

## Resolución de problemas

### La terminal no reconoce `pnpm`

Cerrá y volvé a abrir la terminal después de instalar pnpm. Luego ejecutá:

```powershell
where.exe pnpm.*
pnpm --version
```

### El puerto 3000 está ocupado

Detené el otro proceso de desarrollo con `Ctrl+C`. Si Next.js selecciona automáticamente otro puerto, usá la URL que aparezca en la terminal.

### Las dependencias parecen inconsistentes

Confirmá que estés ejecutando los comandos dentro de `offix-frontend/` y reinstalá las dependencias desde el archivo de bloqueo:

```bash
pnpm install --frozen-lockfile
```

No elimines `pnpm-lock.yaml` ni cambies de gestor de paquetes como solución rápida.

### La compilación se comporta distinto al modo de desarrollo

Ejecutá `pnpm build` para reproducir las verificaciones de producción. Al informar el problema, incluí el error completo, la ruta afectada, el navegador utilizado y los pasos para reproducirlo. No incluyas credenciales ni datos personales de usuarios.
