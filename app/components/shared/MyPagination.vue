<script setup lang="ts">
//👉 Props
withDefaults(
  defineProps<{
    itemsPerPage: number;
    total: number;
  }>(),
  {
    itemsPerPage: 9,
    total: 27,
  },
);

//👉 Models
const page = defineModel<number>("page", { default: 1 });
</script>
<template>
  <UPagination
    v-model:page="page"
    :items-per-page="itemsPerPage"
    show-edges
    :sibling-count="1"
    :total="total"
    :ui="{
      first: 'hidden',
      last: 'hidden',
      ellipsis: 'ellipsis-button',
      list: 'pagination-buttons-container',
    }"
  >
    <template #prev>
      <UButton :label="$t('Previous')" variant="outline" class="prev-button" />
    </template>
    <template #next>
      <UButton :label="$t('Next')" variant="outline" class="next-button" />
    </template>
  </UPagination>
</template>
<style lang="scss">
.pagination-buttons-container {
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  button {
    padding: 8px 13px;
    border: 1px solid #e1e1e1;
    border-radius: 10px;
    box-shadow: none !important;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover:not(.next-button):not(.prev-button),
    &.bg-primary {
      background: #fe6452;
      span {
        color: white;
      }
    }
    span {
      @apply sm:text-base text-sm;
      color: #1f1f1f;
      font-weight: 400;
    }
    &.prev-button,
    &.next-button {
      padding: 8px 16px;
      span {
        @apply sm:text-sm text-xs;
        font-weight: 300;
      }
    }
  }
  .ellipsis-button {
    box-shadow: none !important;
  }
}
</style>
