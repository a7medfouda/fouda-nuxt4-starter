# AGENTS.md

# Project Overview

This project is a modern Nuxt 4 application.

Primary technologies:

- Nuxt 4
- Vue 3
- TypeScript
- Nuxt UI
- Tailwind CSS v4
- Pinia
- Nuxt i18n
- GSAP
- Swiper
- Zod

Always preserve the existing project architecture and coding conventions.

---

# General Principles

Always understand the project before making changes.

Never guess.

Never invent APIs.

Never install dependencies unless explicitly requested.

Never remove existing functionality without approval.

Prefer extending existing code over rewriting it.

Keep changes as small as possible.

Avoid unnecessary abstractions.

If a task is large:

1. Analyze
2. Explain the plan
3. Then implement

---

# Vue Rules

Always use:

```vue
<script setup lang="ts">
```

Never use:

- Options API
- Vue Class Components

Prefer:

- composables
- reusable components
- computed
- watch only when necessary

Avoid unnecessary watchers.

Never mutate props.

Prefer emits over direct parent mutations.

---

# Nuxt Rules

Use Nuxt auto imports.

Prefer:

- useFetch()
- useAsyncData()

Do not fetch data manually unless required.

Always preserve SSR.

Never wrap components inside ClientOnly unless absolutely necessary.

Do not break hydration.

Avoid browser APIs during SSR.

If browser APIs are needed:

- onMounted()
- import.meta.client

Always use route middleware if authentication is required.

For every new page, add appropriate SEO metadata using the existing Nuxt patterns.

At minimum, pages should define meaningful title and description metadata when applicable.

---

# TypeScript

Never use:

```ts
any
```

Prefer:

- interfaces
- types
- inferred types

Always keep strict typing.

Never ignore TypeScript errors.

---

# Components

Keep components small.

One responsibility per component.

Extract repeated UI.

Prefer slots over duplicated code.

Props must always be typed.

Emits must always be typed.

Do not duplicate components.

Search for reusable components first.

---

# Composables

Business logic belongs inside composables.

Never duplicate composables.

Keep composables framework independent whenever possible.

---

# Pinia

Global state belongs in Pinia.

Component-only state should remain inside components.

Persist only required data.

Avoid unnecessary global stores.

---

# Styling

Use Tailwind CSS v4.

Reuse existing utility classes.

Avoid inline styles.

Prefer design consistency.

Spacing should remain consistent.

Avoid arbitrary values unless necessary.

---

# Nuxt UI

Prefer Nuxt UI components whenever possible.

Do not recreate components already available in Nuxt UI.

Keep styling aligned with Nuxt UI.

---

# Internationalization

This project uses Nuxt i18n.

Never hardcode user-facing strings.

Always use translation keys.

RTL must always work correctly.

Layouts must support:

- Arabic
- English

---

# Accessibility

For every new page or component, consider accessibility from the start, at least the basics.

Always use semantic HTML.

Buttons must have accessible labels.

Images require alt text.

Inputs require labels.

Keyboard navigation must work.

---

# Performance

Prefer lazy loading.

Avoid unnecessary client-side rendering.

Minimize bundle size.

Avoid duplicate API calls.

Reuse async data.

Avoid unnecessary watchers.

Avoid unnecessary computed properties.

Use dynamic imports when appropriate.

---

# GSAP

Use GSAP only when necessary.

Always clean animations on unmount.

Never create memory leaks.

---

# Swiper

Reuse existing Swiper configuration.

Avoid duplicated slider logic.

---

# Forms

When a page or component needs form inputs, reuse `app/components/shared/FormFieldRenderer.vue` whenever it supports the required field type.

When a phone input is needed, reuse `app/components/shared/PhoneInput.vue` instead of creating a new phone input.

Validate using Zod.

Validate before API requests.

Display user-friendly errors.

Never trust client-side validation only.

---

# Error Handling

Never silently ignore errors.

Provide meaningful fallback UI.

Handle:

- loading
- empty
- error

states.

---

# Folder Structure

Prefer:

components/

composables/

stores/

pages/

layouts/

middleware/

utils/

types/

constants/

server/

Do not create new folders unless necessary.

---

# API

Never change API contracts.

Do not rename response fields.

Respect existing backend implementation.

Use existing API composables.

---

# Code Style

Prefer readable code.

Avoid over engineering.

Prefer early returns.

Keep functions short.

Meaningful variable names.

Meaningful component names.

---

# Before Editing

Always inspect:

- existing components
- composables
- stores
- utilities

Reuse existing code whenever possible.

---

# Before Finishing

Always:

- Check TypeScript errors
- Check lint errors
- Check hydration
- Check console
- Verify responsive behavior
- Verify RTL
- Verify dark/light mode if supported

Summarize:

- changed files
- why each file changed
- possible risks

---

# Never Do

Never install packages without permission.

Never delete files without approval.

Never change formatting in unrelated files.

Never rewrite working code unnecessarily.

Never introduce breaking changes.

Never ignore SSR.

Never use any.

Never hardcode URLs.

Never hardcode API endpoints.

Never duplicate business logic.

---

# Communication

When a task is requested:

1. Understand the requirement.
2. Inspect the project.
3. Explain the implementation plan.
4. Implement.
5. Verify.
6. Summarize.

Never start coding immediately without understanding the project.
