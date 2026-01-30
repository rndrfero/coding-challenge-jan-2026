<script setup>
/**
 * @param {Object} props
 * @param {string} props.modelValue
 */
const props = defineProps({
  modelValue: { type: String, required: true },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="mobile-sort">
    <label for="sort-select">Sort by:</label>
    <select
      id="sort-select"
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
      class="sort-select"
    >
      <option value="departureAt">Departure Time (earliest)</option>
      <option value="departureAt-desc">Departure Time (latest)</option>
      <option value="duration">Duration (shortest)</option>
      <option value="duration-desc">Duration (longest)</option>
      <option value="price">Price (lowest)</option>
      <option value="price-desc">Price (highest)</option>
    </select>
  </div>
</template>

<style scoped>
.mobile-sort {
  @apply hidden;
}

@media (max-width: 768px) {
  .mobile-sort {
    @apply flex items-center gap-2 mb-4;
  }

  .mobile-sort label {
    @apply text-sm font-semibold text-slate-700;
  }

  .sort-select {
    @apply flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-800;
  }
}
</style>
