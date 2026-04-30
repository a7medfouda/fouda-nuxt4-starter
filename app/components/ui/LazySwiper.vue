<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";

// Import CSS dynamically
if (import.meta.client) {
  import("swiper/css");
  import("swiper/css/navigation");
  import("swiper/css/pagination");
}

defineProps({
  modules: Array,
  items: Array,
});

const swiperReady = ref(false);
</script>

<template>
  <div
    class="lazy-swiper-wrapper"
    :class="{ 'swiper-ready': swiperReady }"
  >
    <Swiper v-bind="$attrs" :modules="modules" @swiper="swiperReady = true">
      <SwiperSlide v-for="item in items" :key="item?.id || item?.title">
        <slot :item="item" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style>
/*
 * Pre-hydration layout: before Swiper CSS is loaded and initialized,
 * use CSS grid to prevent full-width single-slide layout shift.
 * Once Swiper is ready, the wrapper becomes transparent.
 */
.lazy-swiper-wrapper:not(.swiper-ready) .swiper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  overflow: hidden;
}

@media (max-width: 860px) {
  .lazy-swiper-wrapper:not(.swiper-ready) .swiper {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 500px) {
  .lazy-swiper-wrapper:not(.swiper-ready) .swiper {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* Hide overflow slides before Swiper is ready */
.lazy-swiper-wrapper:not(.swiper-ready) .swiper .swiper-slide:nth-child(n + 4) {
  display: none;
}

@media (max-width: 860px) {
  .lazy-swiper-wrapper:not(.swiper-ready) .swiper .swiper-slide:nth-child(n + 3) {
    display: none;
  }
}

@media (max-width: 500px) {
  .lazy-swiper-wrapper:not(.swiper-ready) .swiper .swiper-slide:nth-child(n + 2) {
    display: none;
  }
}
</style>
