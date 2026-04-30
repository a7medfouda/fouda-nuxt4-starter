<script setup lang="ts">
interface Props {
  /** Use 'narrow' for articles, 'default' for standard pages, and 'full' for dashboards */
  size?: "narrow" | "default" | "wide" | "full";
  /** Remove default horizontal padding if needed */
  noPadding?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "default",
  noPadding: false,
});

const sizeClasses = {
  narrow: "max-w-4xl", // ~896px - Best for readability/blog posts
  default: "max-w-7xl", // ~1280px - Standard web container (Bootstrap/Tailwind default)
  wide: "max-w-[1920px]", // ~Ultra-wide - Best for large media-heavy sites
  full: "max-w-full", // 100% - Best for dashboards
};
</script>

<template>
  <div
    :class="[
      'mx-auto w-full transition-all duration-300',
      sizeClasses[props.size],
      !props.noPadding ? 'px-4 sm:px-6 lg:px-8' : '',
    ]"
  >
    <slot />
  </div>
</template>
