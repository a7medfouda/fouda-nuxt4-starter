<script lang="ts" setup>
const { t } = useI18n();
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
    <SharedContainer>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-1">
          <NuxtLink to="/" class="inline-block mb-4"> logo </NuxtLink>
          <p class="text-sm text-gray-500 leading-relaxed">
            {{
              t(
                "Your platform for language learning and personal growth. Join thousands of students today.",
              )
            }}
          </p>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">{{ t("Platform") }}</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/courses"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >{{ t("Courses") }}</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/instructors"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >{{ t("Instructors") }}</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/pricing"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >{{ t("Pricing") }}</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">{{ t("Support") }}</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/faq"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >{{ t("FAQs") }}</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/contact"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >{{ t("Contact Us") }}</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/help"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >{{ t("Help Center") }}</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">{{ t("Legal") }}</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/terms"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >{{ t("Terms of Service") }}</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/privacy"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >{{ t("Privacy Policy") }}</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom -->
      <div
        class="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p class="text-sm text-gray-500">
          © {{ currentYear }} Fekrah Academy. {{ t("All rights reserved.") }}
        </p>
        <div class="flex items-center gap-6">
          <a
            href="#"
            class="text-gray-400 hover:text-blue-600 transition-colors"
            ><UIcon name="i-ph-facebook-logo" class="w-5 h-5"
          /></a>
          <a
            href="#"
            class="text-gray-400 hover:text-blue-600 transition-colors"
            ><UIcon name="i-ph-twitter-logo" class="w-5 h-5"
          /></a>
          <a
            href="#"
            class="text-gray-400 hover:text-blue-600 transition-colors"
            ><UIcon name="i-ph-instagram-logo" class="w-5 h-5"
          /></a>
        </div>
      </div>
    </SharedContainer>
  </footer>
</template>
