# fouda-nuxt4-starter

A modern, fast, and scalable starter template for building web applications, powered by Nuxt 4 and the Vue 3 ecosystem. Designed to be a robust starting point for any new project.

## Features

- **Framework**: [Nuxt 4](https://nuxt.com/) (built on [Vue 3](https://vuejs.org/))
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Nuxt UI v4](https://ui.nuxt.com/) for beautiful, responsive components out of the box.
- **State Management**: [Pinia](https://pinia.vuejs.org/) with persisted state (`@pinia-plugin-persistedstate/nuxt`).
- **Internationalization (i18n)**: Fully configured for multi-language support (RTL/LTR) using `@nuxtjs/i18n`.
- **Validation**: Schema-based form validation using [Zod](https://zod.dev/).
- **Animations**: Integrated with [GSAP](https://gsap.com/) and [Swiper](https://swiperjs.com/) for dynamic UI experiences.
- **Typography & Icons**: Automatic font optimization via `@nuxt/fonts` and built-in icon support via Nuxt UI.
- **Code Quality**: Pre-configured with `@nuxt/eslint` for consistent coding standards.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

## Getting Started

1. **Clone the repository and install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

3. **Build for production:**

   ```bash
   npm run build
   ```

4. **Preview the production build:**

   ```bash
   npm run preview
   ```

## Project Structure

- `app/` - Contains the main application code:
  - `components/` - Vue components organized by feature (e.g., `auth`, `global`).
  - `pages/` - File-based routing pages.
  - `assets/` - Global CSS/SCSS and static assets.
- `server/` - Nuxt server routes and API endpoints.
- `public/` - Static files served directly at the root.

## Configuration

- `nuxt.config.ts`: Main configuration file for Nuxt modules, transitions, and SSR settings.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `eslint.config.mjs`: ESLint configuration.

## License

This project is licensed under the MIT License.
