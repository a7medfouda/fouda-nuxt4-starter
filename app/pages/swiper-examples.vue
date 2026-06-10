<template>
  <div class="min-h-[calc(100vh-64px)]">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-[#002240] via-[#0a3a6e] to-[#002240] py-20 overflow-hidden">
      <div class="absolute bottom-10 left-20 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>

      <SharedContainer class="relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm font-medium mb-8 border border-white/10">
            <UIcon name="i-heroicons-squares-2x2" class="w-4 h-4" />
            Swiper.js
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Swiper
            <span class="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Examples</span>
          </h1>
          <p class="text-lg text-white/60 max-w-2xl mx-auto">
            Interactive carousel demos showcasing different Swiper configurations and effects.
          </p>
        </div>
      </SharedContainer>
    </section>

    <!-- Basic Swiper -->
    <section class="py-20 bg-white">
      <SharedContainer>
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Basic Carousel</h2>
          <p class="text-gray-500 text-sm">Simple horizontal slide with pagination and navigation.</p>
        </div>

        <ClientOnly>
          <Swiper
            :modules="[SwiperPagination, SwiperNavigation]"
            :slides-per-view="1"
            :space-between="24"
            :pagination="{ clickable: true }"
            :navigation="true"
            :breakpoints="{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }"
            class="swiper-demo pb-12"
          >
            <SwiperSlide v-for="i in 6" :key="`basic-${i}`">
              <div class="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 group">
                <div class="h-48 flex items-center justify-center" :class="cardColors[(i - 1) % cardColors.length]">
                  <span class="text-white text-5xl font-bold opacity-80 group-hover:scale-110 transition-transform duration-300">{{ i }}</span>
                </div>
                <div class="p-5">
                  <h3 class="font-semibold text-gray-900 mb-1">Slide {{ i }}</h3>
                  <p class="text-sm text-gray-500">Sample card content for demo.</p>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </SharedContainer>
    </section>

    <!-- Autoplay Swiper -->
    <section class="py-20 bg-gray-50">
      <SharedContainer>
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Autoplay Carousel</h2>
          <p class="text-gray-500 text-sm">Automatically transitions between slides with a smooth effect.</p>
        </div>

        <ClientOnly>
          <Swiper
            :modules="[SwiperAutoplay, SwiperPagination]"
            :slides-per-view="1"
            :space-between="24"
            :autoplay="{ delay: 2500, disableOnInteraction: false }"
            :pagination="{ clickable: true }"
            :breakpoints="{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }"
            :loop="true"
            class="swiper-demo pb-12"
          >
            <SwiperSlide v-for="i in 8" :key="`auto-${i}`">
              <div class="rounded-2xl p-6 border border-gray-100 bg-white hover:shadow-lg transition-all duration-300 text-center">
                <div class="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center" :class="cardColors[(i - 1) % cardColors.length]">
                  <UIcon :name="icons[(i - 1) % icons.length]" class="w-7 h-7 text-white" />
                </div>
                <h3 class="font-semibold text-gray-900 mb-1">Feature {{ i }}</h3>
                <p class="text-xs text-gray-500">Autoplay slide demo content.</p>
              </div>
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </SharedContainer>
    </section>

    <!-- Coverflow Effect -->
    <section class="py-20 bg-white">
      <SharedContainer>
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Coverflow Effect</h2>
          <p class="text-gray-500 text-sm">3D perspective with depth and rotation for a visually striking carousel.</p>
        </div>

        <ClientOnly>
          <Swiper
            :modules="[SwiperEffectCoverflow, SwiperPagination]"
            :slides-per-view="'auto'"
            :centered-slides="true"
            :space-between="30"
            :pagination="{ clickable: true }"
            effect="coverflow"
            :coverflow-effect="{
              rotate: 30,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }"
            class="swiper-demo pb-12"
          >
            <SwiperSlide v-for="i in 7" :key="`cover-${i}`" class="!w-[280px]">
              <div class="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div class="h-56 flex items-center justify-center" :class="cardColors[(i - 1) % cardColors.length]">
                  <div class="text-center">
                    <span class="text-white text-6xl font-bold opacity-60">{{ i }}</span>
                    <p class="text-white/70 text-sm mt-2">Coverflow Slide</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </SharedContainer>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination as SwiperPagination, Navigation as SwiperNavigation, Autoplay as SwiperAutoplay, EffectCoverflow as SwiperEffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

const cardColors = [
  "bg-gradient-to-br from-blue-500 to-indigo-600",
  "bg-gradient-to-br from-purple-500 to-pink-600",
  "bg-gradient-to-br from-emerald-500 to-teal-600",
  "bg-gradient-to-br from-orange-500 to-red-600",
  "bg-gradient-to-br from-cyan-500 to-blue-600",
  "bg-gradient-to-br from-pink-500 to-rose-600",
];

const icons = [
  "i-heroicons-bolt",
  "i-heroicons-heart",
  "i-heroicons-star",
  "i-heroicons-globe-alt",
  "i-heroicons-rocket-launch",
  "i-heroicons-sparkles",
  "i-heroicons-light-bulb",
  "i-heroicons-fire",
];
</script>

<style scoped>
:deep(.swiper-demo .swiper-pagination-bullet) {
  background: #002240;
  opacity: 0.3;
}
:deep(.swiper-demo .swiper-pagination-bullet-active) {
  opacity: 1;
}
:deep(.swiper-demo .swiper-button-next),
:deep(.swiper-demo .swiper-button-prev) {
  color: #002240;
  --swiper-navigation-size: 28px;
}
</style>
