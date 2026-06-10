<template>
  <div class="min-h-[calc(100vh-64px)]">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-[#002240] via-[#0a3a6e] to-[#002240] py-20 overflow-hidden">
      <div class="absolute top-20 right-20 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>

      <SharedContainer class="relative z-10">
        <div class="text-center max-w-2xl mx-auto">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium mb-8 border border-white/10">
            <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
            {{ t("Contact Us") }}
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            {{ t("Get In Touch") }}
          </h1>
          <p class="text-lg text-white/60 leading-relaxed">
            {{ t("Have a question or want to work together? We'd love to hear from you.") }}
          </p>
        </div>
      </SharedContainer>
    </section>

    <!-- Contact Cards & Form -->
    <section class="py-20 bg-white">
      <SharedContainer>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div v-for="(item, i) in contactInfo" :key="i" class="p-6 rounded-2xl border border-gray-100 hover:border-[#002240]/20 hover:shadow-xl hover:shadow-[#002240]/5 transition-all duration-300 text-center">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" :class="item.bg">
              <UIcon :name="item.icon" class="w-6 h-6" :class="item.color" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">{{ item.title }}</h3>
            <p class="text-sm text-gray-500">{{ item.value }}</p>
          </div>
        </div>

        <!-- Form -->
        <div class="max-w-2xl mx-auto">
          <div class="rounded-2xl border border-gray-100 p-8 md:p-10">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ t("Send us a message") }}</h2>
            <p class="text-gray-500 text-sm mb-8">{{ t("Fill out the form and we'll get back to you as soon as possible.") }}</p>

            <form class="space-y-6" @submit.prevent>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ t("Full Name") }}</label>
                  <input
                    type="text"
                    :placeholder="t('Enter your full name')"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#002240] focus:ring-2 focus:ring-[#002240]/10 outline-none transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">{{ t("Email Address") }}</label>
                  <input
                    type="email"
                    :placeholder="t('Enter your email')"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#002240] focus:ring-2 focus:ring-[#002240]/10 outline-none transition-all duration-200 text-sm"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ t("Message") }}</label>
                <textarea
                  rows="5"
                  :placeholder="t('Write your message here')"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#002240] focus:ring-2 focus:ring-[#002240]/10 outline-none transition-all duration-200 text-sm resize-none"
                ></textarea>
              </div>
              <UButton
                type="submit"
                color="primary"
                size="lg"
                block
                class="!rounded-xl !font-medium !bg-gradient-to-r !from-[#002240] !to-[#0a4a8a]"
              >
                {{ t("Send Message") }}
              </UButton>
            </form>
          </div>
        </div>
      </SharedContainer>
    </section>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const contactInfo = [
  {
    icon: "i-heroicons-map-pin",
    title: t("Our Address"),
    value: "Riyadh, Saudi Arabia",
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    icon: "i-heroicons-envelope",
    title: t("Email Address"),
    value: "hello@starter.dev",
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    icon: "i-heroicons-phone",
    title: t("Phone"),
    value: "+966 50 000 0000",
    bg: "bg-emerald-100",
    color: "text-emerald-600",
  },
];
</script>
