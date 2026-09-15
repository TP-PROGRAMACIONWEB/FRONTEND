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

## Instalar las dependencias

Desde la raíz del repositorio:

```bash
cd offix-frontend
pnpm install --frozen-lockfile
```

Las fuentes de verdad para las dependencias son `offix-frontend/package.json` y `offix-frontend/pnpm-lock.yaml`. El archivo `requirements.txt` de la raíz solamente explica esta configuración de Node.js; no es un manifiesto de paquetes de Python ni de Node.

## Configurar las variables de entorno

Actualmente, la aplicación no tiene variables de entorno definidas.

Cuando se incorpore configuración:

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

Actualmente, la ruta principal no contiene una interfaz visible del producto. Los flujos funcionales, la integración con el backend, los componentes de shadcn/ui, las notificaciones de Sonner y el sistema tipográfico completo todavía no están implementados.

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
