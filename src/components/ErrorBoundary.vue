<script setup>
import { ref, onErrorCaptured } from "vue";

const props = defineProps({
  fallback: {
    type: String,
    default: "Something went wrong. Please try again.",
  },
  showDetails: {
    type: Boolean,
    default: false,
  },
});

const hasError = ref(false);
const error = ref(null);

onErrorCaptured((err, instance, info) => {
  hasError.value = true;
  error.value = err;
  console.error("Error caught by boundary:", err, info);
  return false; // Prevents error from propagating
});
</script>

<template>
  <div v-if="hasError" class="error-boundary" role="alert" aria-live="assertive">
    <p>{{ fallback }}</p>
    <details v-if="showDetails && error">
      <summary>Error details</summary>
      <pre>{{ error.message }}</pre>
    </details>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  @apply p-4 bg-red-50 border border-red-200 rounded-md text-red-800;

  details {
    @apply mt-2;
  }

  summary {
    @apply cursor-pointer text-sm;
  }

  pre {
    @apply mt-2 text-xs overflow-auto;
  }
}
</style>
