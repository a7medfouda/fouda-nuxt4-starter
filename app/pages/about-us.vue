<template>
  <div class="min-h-[calc(100vh-64px)]">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-[#002240] via-[#0a3a6e] to-[#002240] py-24 overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl"></div>

      <SharedContainer class="relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium mb-8 border border-white/10">
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
            {{ t("About Us") }}
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            {{ t("We Build") }}
            <span class="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">{{ t("Amazing Experiences") }}</span>
          </h1>
          <p class="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            {{ t("We're a passionate team dedicated to creating modern, fast, and beautiful digital experiences using cutting-edge technologies.") }}
          </p>
        </div>
      </SharedContainer>
    </section>

    <!-- Values Section -->
    <section class="py-20 bg-white">
      <SharedContainer>
        <div class="text-center mb-14">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ t("Our Values") }}</h2>
          <p class="text-gray-500 max-w-xl mx-auto">{{ t("The principles that guide everything we do.") }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(value, i) in values" :key="i" class="group p-8 rounded-2xl border border-gray-100 hover:border-[#002240]/20 hover:shadow-xl hover:shadow-[#002240]/5 transition-all duration-300">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300" :class="value.bg">
              <UIcon :name="value.icon" class="w-6 h-6" :class="value.color" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ value.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ value.description }}</p>
          </div>
        </div>
      </SharedContainer>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-gray-50">
      <SharedContainer>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="(stat, i) in stats" :key="i" class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-[#002240] mb-2">{{ stat.number }}</div>
            <div class="text-sm text-gray-500 font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </SharedContainer>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-white">
      <SharedContainer>
        <div class="text-center mb-14">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ t("Our Team") }}</h2>
          <p class="text-gray-500 max-w-xl mx-auto">{{ t("The people behind the scenes making magic happen.") }}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div v-for="(member, i) in team" :key="i" class="text-center group">
            <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <UIcon name="i-heroicons-user" class="w-10 h-10 text-gray-400" />
            </div>
            <h3 class="font-semibold text-gray-900 text-lg">{{ member.name }}</h3>
            <p class="text-sm text-gray-500">{{ member.role }}</p>
          </div>
        </div>
      </SharedContainer>
    </section>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const values = [
  {
    icon: "i-heroicons-bolt",
    title: t("Performance"),
    description: t("We build lightning-fast applications that deliver outstanding user experiences."),
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    icon: "i-heroicons-swatch",
    title: t("Design"),
    description: t("Beautiful, intuitive interfaces that users love and find easy to navigate."),
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    icon: "i-heroicons-shield-check",
    title: t("Quality"),
    description: t("Rigorous standards and best practices to ensure reliable, maintainable code."),
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },
];

const stats = [
  { number: "50+", label: t("Projects Completed") },
  { number: "20+", label: t("Team Members") },
  { number: "99%", label: t("Client Satisfaction") },
  { number: "5+", label: t("Years Experience") },
];

const team = [
  { name: "Ahmed Hassan", role: t("Lead Developer") },
  { name: "Sarah Al-Rashid", role: t("UI/UX Designer") },
  { name: "Omar Khalid", role: t("Backend Engineer") },
];
</script>
