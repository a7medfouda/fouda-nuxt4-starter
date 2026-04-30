<template>
  <div class="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center py-20 bg-gray-50">
    <SharedContainer class="w-full max-w-5xl mx-auto px-4 text-center flex flex-col items-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
        <UIcon name="i-heroicons-rocket-launch" class="w-4 h-4" />
        fouda-nuxt4-starter
      </div>

      <!-- Headline -->
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 max-w-4xl">
        Welcome to Your New
        <span class="text-blue-600 block mt-2">Nuxt 4 Project</span>
      </h1>

      <!-- Description -->
      <p class="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
        A modern, fast, and scalable starter template packed with Vue 3, Tailwind CSS v4, Nuxt UI v4, Pinia, and i18n support. Ready for your next big idea.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <UButton size="xl" color="primary" to="https://nuxt.com/docs" target="_blank" class="w-full sm:w-auto px-8">
          Nuxt Documentation
          <UIcon name="i-heroicons-arrow-right" class="ml-2 w-5 h-5 rtl:rotate-180" />
        </UButton>
        <UButton size="xl" color="white" variant="solid" to="https://ui.nuxt.com" target="_blank" class="w-full sm:w-auto px-8 border border-gray-200">
          Nuxt UI Components
        </UButton>
      </div>

      <!-- Features/Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 w-full border-t border-gray-200 pt-12">
        <div class="flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
            <UIcon name="i-heroicons-bolt" class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">Blazing Fast</h3>
          <p class="text-sm text-gray-500">Powered by Vite and Nuxt 4</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mb-4">
            <UIcon name="i-heroicons-swatch" class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">Beautiful UI</h3>
          <p class="text-sm text-gray-500">Tailwind v4 & Nuxt UI built-in</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <div class="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
            <UIcon name="i-heroicons-globe-alt" class="w-6 h-6" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-1">i18n Ready</h3>
          <p class="text-sm text-gray-500">Fully configured for localization</p>
        </div>
      </div>
    </SharedContainer>
  </div>
</template>

<script lang="ts" setup>
// Starter page logic can go here
</script>
