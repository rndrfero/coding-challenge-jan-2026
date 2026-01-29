<script setup>
import { formatPrice } from "../utils/formatters";

const props = defineProps({
  fares: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="fare-details">
    <div v-for="(fare, index) in fares" :key="index" class="item">
      <div class="name">{{ fare.name }}</div>
      <div class="price">
        {{ fare.currency }} {{ formatPrice(fare.price_in_cents) }}
      </div>
      <div class="class">Class {{ fare.comfort_class }}</div>
    </div>
  </div>
</template>

<style>
.fare-details {
  @apply bg-slate-50 py-3 px-4;

  .item {
    @apply flex items-center py-3.5 border-b border-gray-300 last:border-b-0;
  }

  .name {
    @apply text-sm font-medium text-slate-800 flex-none text-left min-w-[120px];
  }

  .price {
    @apply text-sm font-semibold flex-1 text-center text-blue-600;
  }

  .class {
    @apply text-xs flex-none text-right text-gray-500 min-w-[80px];
  }

  @media (max-width: 768px) {
    .item {
      @apply flex-col items-stretch py-3 gap-2;
    }

    .name {
      @apply min-w-0 text-base;
    }

    .price {
      @apply text-lg text-left;
    }

    .class {
      @apply min-w-0 text-left text-sm;
    }
  }
}
</style>
