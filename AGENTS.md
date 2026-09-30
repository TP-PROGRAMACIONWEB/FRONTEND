# OFFIX Frontend Agent Guide

## Purpose

This repository contains the frontend for OFFIX, a web platform that connects local clients with trade professionals. The product must make it possible to find, compare, contact, and hire professionals while giving professionals a clean way to present their services and find work opportunities.

The Next.js application is located in `offix-frontend/`. Run all package-manager and application commands from that directory unless a command explicitly states otherwise.

## Instruction Priority

1. Follow the developer's explicit request for the current task.
2. Follow this file and the approved product scope.
3. Follow the existing codebase and its locked dependency versions.
4. When a material decision is not covered, stop and ask the developer a focused question.

Never invent product behavior, validation rules, API contracts, UI states, or new features. Do not silently choose an important default when requirements are missing.

## Approved Product Scope

### Professional user

A professional offers services for a trade. The approved capabilities are:

- Register, sign in, and sign out.
- Create and edit a professional profile.
- Provide a profile photo, full name, trade or category, professional license, work schedule, phone number, geographic coverage area, contact methods, and a text description.
- Indicate whether emergency work is available outside normal hours.
- Attach a limited number of files with a limited file size.
- Submit a professional license for profile verification and display a verification badge when verification is confirmed.
- Communicate with clients through WhatsApp.
- Receive email notifications.
- Send a link that lets a client submit a review.
- Approve or cancel client reviews.

The professional profile must remain static, focused, and clean. Do not turn it into a social network profile.

### Administrator user

An administrator is operational platform staff. The approved capabilities are:

- Manage users.
- Block or suspend users.
- Manage reports.
- Moderate reviews.
- Manage trade categories.
- Consult activity logs.

### Client interactions

The product objective mentions client search, comparison, contact, hiring, service-need publication, ratings, and reviews. However, an authenticated `Client` role and its complete permissions are not yet specified. Treat client-facing workflows as incomplete requirements. Do not invent client registration, client profiles, authorization rules, hiring states, or publication workflows.

### Explicitly out of scope

Do not implement or prepare hidden infrastructure for:

- Payment gateways, including Mercado Pago and Stripe.
- Social-network features such as feeds, stories, or photo walls.
- Real-time web or mobile push notifications.
- Formal automated quotes or budgets inside chat.

## Decisions That Require Developer Confirmation

Ask before implementing any affected feature when the following details are still unspecified:

- The exact client role, authentication model, and permissions.
- Search filters, comparison behavior, ranking, pagination, and location radius rules.
- The workflow for publishing service needs.
- The meaning and lifecycle of hiring or service completion.
- Review eligibility, rating scale, moderation states, approval/cancellation semantics, and public visibility.
- Professional license formats, verification states, verifier permissions, and badge rules.
- Attachment count, maximum size, accepted MIME types, retention, and removal behavior.
- Phone, WhatsApp, schedule, emergency-service, geographic coverage, and description validation rules.
- Email-notification triggers and templates.
- Authentication transport, session persistence, token refresh, and logout behavior.
- REST endpoints, payloads, error shapes, pagination metadata, and versioning.
- The image-upload authorization and confirmation protocol with the backend and Cloudflare.
- Responsive breakpoints or interaction behavior not established by an approved design.

## Approved Frontend Stack

Use only:

- Next.js with the App Router and React.
- TypeScript in strict mode.
- Tailwind CSS.
- shadcn/ui for UI components.
- shadcn Sonner for in-application toast notifications.
- Huge Icons through the already installed `hugeicons-react` package.
- pnpm for dependency installation and scripts.

Do not add a package, framework, state manager, form library, validation library, icon library, date library, HTTP client, test library, or other dependency without developer approval. Explain the concrete need, alternatives, bundle impact, and maintenance cost when suggesting one.

Official dependencies added automatically by a developer-approved shadcn/ui component must be disclosed before running the add command. Do not use the shadcn CLI to add components speculatively.

Use browser APIs, React, Next.js, and TypeScript before proposing a dependency when they solve the requirement clearly and safely.

### Dependency source of truth

- `offix-frontend/package.json` declares Node dependencies and scripts.
- `offix-frontend/pnpm-lock.yaml` locks the resolved dependency graph.
- Use `pnpm install`; never use npm, Yarn, or Bun to install project dependencies.
- Do not generate `package-lock.json`, `yarn.lock`, or `bun.lock`.
- The repository-level `requirements.txt` is informational because this frontend has no Python dependencies. Never place Node packages in it.

## Architecture Boundaries

### Frontend layer

- Next.js, React, TypeScript, Tailwind CSS, and shadcn/ui provide a responsive, interactive interface.
- Prefer Server Components by default. Add `"use client"` only when browser APIs, client state, effects, or event handlers require it.
- Use SSR where it materially supports performance and navigation requirements. Do not force every route to be dynamic without evidence.
- Communicate with the FastAPI backend through HTTP, including the approved file-upload flow.
- Consume approved Cloudflare CDN image URLs directly for image delivery.

### Backend layer

- The backend is a Python FastAPI REST API hosted on Render.
- It owns business logic, authentication, authorization, server-side validation, database reads and writes, and image-upload validation and confirmation.
- Frontend validation improves safety and usability but never replaces backend enforcement.
- Do not duplicate backend business decisions in the frontend unless the API contract explicitly requires a matching presentation rule.

### Persistence layer

- PostgreSQL is provided through Supabase.
- The frontend must never connect directly to PostgreSQL or use database credentials.
- All user, profile, publication, review, interaction-history, and other application data goes through the backend API.

### Image-storage layer

- Cloudflare stores and delivers user images through its CDN.
- The backend validates and manages confirmation of uploads.
- The frontend may render approved CDN resources directly, but it must not embed Cloudflare secrets or invent a direct-upload protocol.
- Configure external image hosts in `next.config.ts` only after the exact approved hostname and path rules are known.

## TypeScript and Naming Rules

- Keep TypeScript strict. Do not use `any`, unsafe casts, or non-null assertions to bypass a type problem.
- Model API input, success, and error payloads explicitly once the backend contract is approved.
- Keep variables, functions, parameters, properties owned by the frontend, CSS classes, and filenames in English `snake_case`.
- React component and TypeScript type identifiers must begin with an uppercase letter to work correctly in JSX and type positions. Use `Upper_Snake_Case`, for example `Professional_profile_card` and `Professional_profile_props`.
- Use lowercase `snake_case` for other identifiers, for example `professional_profile`, `coverage_area`, and `handle_form_submit`.
- Use lowercase `snake_case` for custom component filenames, for example `professional_profile_card.tsx`.
- Framework-reserved filenames such as `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, and `not-found.tsx` are exceptions.
- External API field names, generated code, library exports, HTML attributes, CSS properties, and Tailwind utility classes are exceptions; preserve their required spelling.
- Prefer named types over duplicated inline object shapes when the type is shared.
- Remove unused imports, unreachable code, redundant state, unnecessary effects, and avoidable wrappers.

## Component Rules

- Build small components with one clear responsibility.
- Every custom component must be reusable where its responsibility is shared. Reuse the existing component instead of duplicating equivalent UI, behavior, icons, or button styles.
- Buttons that perform the same action must use the same reusable component, visual format, and Huge Icon.
- Prefer composition over deeply configurable components.
- Keep route-specific components close to their route; move a component to a shared location only after real reuse or a clear shared responsibility exists.
- Prefer Server Components and pass serializable data to Client Components.
- Do not copy a shadcn/ui component into a new abstraction unless OFFIX behavior or styling makes the abstraction useful.
- Use Sonner for transient in-app feedback. Do not use browser `alert()` for normal product feedback.
- Represent loading, empty, success, disabled, and error states required by an approved workflow.
- Do not expose raw backend errors to users. Preserve useful diagnostic context for development without leaking secrets or personal data.

## Forms and Frontend Validation

- Validate every field entered or file selected by a user, even when the backend also validates it.
- Validate on submission and provide accessible, field-level feedback where applicable.
- Use field-specific validation messages in clear Spanish; do not rely on the browser's generic form-validation copy for the maintained user flows.
- Normalize only when the approved data contract permits it; do not silently alter user data.
- Reject unsupported file types and enforce approved file count and size before upload.
- Do not invent regular expressions, length limits, geographic rules, or license rules. Ask for exact requirements first.
- Disable duplicate submissions while a request is pending and make retry behavior explicit.
- Treat backend validation errors as authoritative and map them to the relevant fields when the contract provides enough information.
- Do not add a form or schema-validation library without approval.

## UI and Design System

Use semantic design tokens rather than scattering hexadecimal values through components.

| Purpose | Value | Status |
| --- | --- | --- |
| General background | `#F3F0F7` | Approved |
| Cards and form surfaces | `#FAF8FC` | Approved |
| Secondary component color | `#6E8898` | Approved |
| Header and dropdown-menu background | `#231942` | Approved |
| Headings, primary actions and text on light backgrounds | `#231942` | Approved |
| Text and icons on `#231942` surfaces | `#F3F0F7` | Approved |

- Do not invent additional brand colors. Ask when a semantic state needs an unspecified color.
- Derive hover treatments from the semantic token already used by the component. Primary and step buttons must become slightly lighter on hover; do not introduce a separate hard-coded hover color.
- Verify accessible contrast, visible keyboard focus, disabled-state clarity, and non-color status indicators.
- Use Montserrat at weight `800` for headings and titles.
- Use Montserrat at weight `600` for text inside every button and button-like link.
- Use Raleway at weight `400` for body text, paragraphs, footers, and similar content.
- Load both Google fonts through `next/font/google`; do not use remote CSS `@import` rules or unnecessary `.ttf`/`.otf` assets.
- Use `#231942` for `h1` and `h2` text on light surfaces.
- Standard affirmative and navigation buttons use a `#231942` background with `#F3F0F7` text and icons. Existing cancel and delete/destructive variants are explicit exceptions and must retain their differentiated styling.
- Every clickable button and button-like link must show the pointer cursor, a visible keyboard focus treatment, a disabled state when applicable, and a modest lightening hover transition.
- Use Huge Icons for meaningful button and navigation icons. Keep decorative icons hidden from assistive technology and preserve an accessible text label or `aria-label` for icon-only controls.
- Cards and main headers must not use gray outline borders. Separate cards through the approved surface color, spacing and restrained shadow; keep the visual hierarchy clean rather than adding decorative containers.
- Cards used for login, professional profiles and related account states must share the same surface, radius, spacing and shadow language.
- Use the validation-card shadow language only on the outermost card surface of a landing page or form. Nested cards and internal informational surfaces must not use shadows. Forms and future form landing pages must be contained in one prominent card surface using that shared language.
- Inputs must retain a visible border and focus state. Do not remove their border as part of card cleanup.
- Every user-editable field must have a descriptive, generic example placeholder when an example improves comprehension, such as `ejemplo@gmail.com`. A placeholder never replaces the visible label.
- Contact information displayed for reference, including email and phone, is non-editable and uses the primary purple text color so it remains legible.
- Do not show internal module labels, task codes or development headings such as `Sistema de Reseñas`, `T01`, `T02` or `Módulo`. Do not add duplicate test CTAs that are absent from the approved mockup.
- Full-page application headers use the primary purple background with the light OFFIX logo and light foreground content. Navigation actions that would disappear against that background may use the approved light outlined treatment.
- Every application page must render the shared full-page application header. Do not duplicate header markup in individual routes.
- Use explicit icon-and-text navigation: the home action uses a house icon and `Inicio`; returning from a professional profile uses a left arrow and a concise `Volver a profesionales` label.
- In the authenticated header, keep notifications visible in the header and place secondary navigation in a right-side hamburger menu. The sidebar opens from the right, adapts to mobile without covering the full viewport, shows the profile name at the top, and keeps `Cerrar sesión` at the bottom. `Ver oferentes` is available only from the guest login flow.
- Error toasts remain visible for `5000` ms and success toasts for `3000` ms. Keep messages concise, actionable and free of raw backend details.
- Use `next/image` for supported application images when its optimization and layout behavior apply.
- Provide meaningful alternative text for informative images and empty alternative text for decorative images.
- Preserve semantic HTML, logical heading order, labels, keyboard access, and clear focus behavior.
- Maintain responsive spacing and control sizing. Compact secondary navigation buttons are preferred, but touch targets must remain usable and labels must not become ambiguous.
- Do not introduce dark mode until its palette and behavior are approved.

## Security and Privacy

- Never commit credentials, private tokens, API secrets, database connection strings, or private keys.
- Keep local secrets in ignored `.env.local` files and document required keys with empty placeholders in `.env.example` when environment variables are introduced.
- Anything prefixed with `NEXT_PUBLIC_` is exposed to the browser. Use that prefix only for intentionally public configuration such as an approved public base URL.
- A browser cannot securely hold a secret. Do not move a credential into frontend environment variables to hide it.
- Do not store authentication tokens in local storage or choose a cookie/session strategy without an approved authentication contract.
- Do not log passwords, tokens, license documents, personal contact data, uploaded file contents, or complete backend responses containing personal data.
- Encode rendered content through React and avoid `dangerouslySetInnerHTML`. If approved content ever requires HTML, obtain an approved sanitization strategy first.
- Validate URLs and prevent user-controlled redirect targets or unsafe protocols.
- Apply least privilege to every UI action and never rely on hidden controls as authorization.

## API and Error Handling

- Centralize repeated HTTP behavior only when actual repetition exists; do not create speculative infrastructure.
- Use the native `fetch` support provided by Next.js unless the developer approves another client.
- Set explicit request methods, headers, cache behavior, and credentials based on the approved endpoint contract.
- Handle network failure, timeouts when specified, non-2xx responses, malformed responses, and empty responses deliberately.
- Do not assume a response shape or silently substitute fake production data.
- Keep mock data clearly isolated and use it only when the developer explicitly approves it.
- Respect server/client boundaries: server-only values must never enter Client Component bundles.

## Performance and Maintainability

- Optimize for readable, maintainable code first, then remove demonstrated bottlenecks.
- Avoid unnecessary client JavaScript, duplicate requests, oversized component trees, and repeated calculations.
- Use dynamic imports only when they provide a real loading or bundle benefit.
- Preserve Next.js caching semantics intentionally; do not select static, dynamic, or revalidation behavior by guesswork.
- Keep comments focused on rationale and constraints, not line-by-line narration.
- Do not add abstractions for hypothetical future features.

## Documentation Requirements

Write and maintain `README.md` and `DOCUMENTATION.md` in Argentine Spanish. Keep code identifiers, commands, filenames, library names, and other required technical terms unchanged. Prefer clear Rioplatense instructions such as `ejecutá`, `abrí`, and `verificá` when addressing the reader directly.

### `README.md`

Keep the repository README usable by QA and other non-implementing technical collaborators. It must document:

- Prerequisites and dependency installation.
- Environment setup without secret values.
- Development, lint, build, production-start, and relevant QA commands.
- Ports, URLs, and technical troubleshooting that do not require programming.
- Any operational change that affects how the frontend is installed, started, configured, or verified.

### `DOCUMENTATION.md`

Keep the architecture and component catalog current.

- Document every custom component that is part of the maintained application.
- For each custom component, include its purpose, location, rendering environment, interface, variants/states, dependencies, and precise customization points.
- For every imported shadcn/ui component, record its name, local path, purpose, and official documentation link.
- Update the architecture section when data flow, rendering, directories, integration boundaries, or ownership changes.
- Do not claim an intended component or integration is already implemented.

Update the relevant documentation in the same change as the code or configuration it describes. When either `README.md` or `DOCUMENTATION.md` changes, confirm that the other remains accurate and consistent.

## Verification Before Completion

Run from `offix-frontend/`:

```bash
pnpm lint
pnpm build
```

Also perform focused manual checks for the changed workflow. Do not add a test framework without approval. If a command cannot run, report the exact reason and what remains unverified.

Do not create a `tests/` directory; any automated test suite must be temporary and deleted immediately after the required test run finishes.

Before handing off a change, confirm:

- The implementation stays within approved scope.
- Missing business decisions were asked rather than invented.
- No unapproved dependency was added.
- Types, names, validation, accessibility, security, and responsive behavior were checked.
- Secrets and personal data are not exposed or logged.
- `README.md` and `DOCUMENTATION.md` were updated when affected.
- Lint and build results are reported accurately.

una buena pregunta es menos costosa que una corrección, pregunta antes de tomar decisiones importantes
