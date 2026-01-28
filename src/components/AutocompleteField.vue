<script setup>
import { ref, watch } from "vue";
import { useAutocompleteApi } from "../composables/useAutocompleteApi";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const query = ref(props.modelValue || "");
const isOpen = ref(false);

const { isLoading, error, results, fetchStations } = useAutocompleteApi();

watch(
  () => props.modelValue,
  (value) => {
    if (value !== query.value) {
      query.value = value || "";
    }
  },
);

async function handleInput(event) {
  const value = event.target.value;
  query.value = value;
  emit("update:modelValue", value);

  if (!value) {
    isOpen.value = false;
    return;
  }

  isOpen.value = true;
  await fetchStations(value);
}

function selectOption(option) {
  const value = option.translatedName || option.name || "";
  query.value = value;
  emit("update:modelValue", value);
  isOpen.value = false;
}

function handleBlur() {
  // Delay closing so option mousedown can fire before blur hides the panel
  setTimeout(() => {
    isOpen.value = false;
  }, 100);
}
</script>

<template>
  <div class="autocomplete">
    <label class="autocomplete-label">{{ label }}</label>
    <input
      class="autocomplete-input"
      type="text"
      :placeholder="placeholder"
      :value="query"
      @input="handleInput"
      @focus="query && (isOpen = true)"
      @blur="handleBlur"
      @keydown.escape.stop.prevent="isOpen = false"
    />

    <div v-if="isOpen" class="autocomplete-panel">
      <div v-if="isLoading" class="autocomplete-status">Searching…</div>
      <div v-else-if="error" class="autocomplete-status error">
        {{ error }}
      </div>
      <ul v-else-if="results.length > 0" class="autocomplete-list">
        <li
          v-for="(item, index) in results"
          :key="index"
          class="autocomplete-option"
          @mousedown.prevent="selectOption(item)"
        >
          {{ item.translatedName || item.name }}
        </li>
      </ul>
      <div v-else class="autocomplete-status">No results</div>
    </div>
  </div>
</template>

<style scoped>
.autocomplete {
  @apply relative flex flex-col gap-1;
}

.autocomplete-label {
  @apply text-sm font-medium text-slate-700;
}

.autocomplete-input {
  @apply border border-slate-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.autocomplete-panel {
  @apply absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-md;
  top: 100px;
}

.autocomplete-status {
  @apply px-3 py-2 text-xs text-slate-600;
}

.autocomplete-status.error {
  @apply text-red-600;
}

.autocomplete-list {
  @apply max-h-64 overflow-y-auto;
}

.autocomplete-option {
  @apply px-3 py-2 text-sm text-slate-800 cursor-pointer hover:bg-slate-100;
}
</style>
