<script setup>
import { ref, watch, onUnmounted } from "vue";
import { useAutocompleteApi } from "../composables/useAutocompleteApi";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
  },
  placeholder: {
    type: String,
  },
});

const emit = defineEmits(["update:modelValue"]);

const query = ref(props.modelValue || "");
const isOpen = ref(false);
let debounceTimer = null;
let blurTimer = null;

const { isLoading, error, results, fetchStations } = useAutocompleteApi();

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  if (blurTimer) {
    clearTimeout(blurTimer);
    blurTimer = null;
  }
});

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

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  if (!value) {
    isOpen.value = false;
    return;
  }

  isOpen.value = true;

  debounceTimer = setTimeout(async () => {
    await fetchStations(value);
  }, 300);
}

function selectOption(option) {
  const value = option.translatedName;
  query.value = value;
  emit("update:modelValue", value);
  isOpen.value = false;
}

function handleBlur() {
  // Delay closing so option mousedown can fire before blur hides the panel
  if (blurTimer) {
    clearTimeout(blurTimer);
  }
  blurTimer = setTimeout(() => {
    isOpen.value = false;
    blurTimer = null;
  }, 100);
}
</script>

<template>
  <div class="autocomplete-field">
    <label>{{ label }}</label>
    <input
      type="text"
      :placeholder="placeholder"
      :value="query"
      :aria-label="label"
      :aria-expanded="isOpen"
      aria-autocomplete="list"
      @input="handleInput"
      @focus="query && (isOpen = true)"
      @blur="handleBlur"
      @keydown.escape.stop.prevent="isOpen = false"
    />

    <div
      v-if="isOpen"
      class="panel"
      role="listbox"
      :aria-label="`${label} suggestions`"
    >
      <div v-if="isLoading" class="status" aria-live="polite" aria-busy="true">
        Searching…
      </div>
      <div v-else-if="error" class="status error" aria-live="assertive">
        {{ error }}
      </div>
      <ul v-else-if="results.length > 0" class="list">
        <li
          v-for="item in results"
          :key="item.code"
          class="option"
          role="option"
          @mousedown.prevent="selectOption(item)"
        >
          <span class="main">
            {{ item.translatedName }}
          </span>
          <span class="secondary"> ({{ item.name }}) </span>
        </li>
      </ul>
      <div v-else class="status">No results</div>
    </div>
  </div>
</template>

<style>
.autocomplete-field {
  @apply relative flex flex-col gap-1;

  label {
    @apply text-sm font-medium text-slate-700;
  }

  input {
    @apply border border-slate-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  }

  .panel {
    @apply absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-md;
    top: 60px;
  }

  .status {
    @apply px-3 py-2 text-xs text-slate-600;

    &.error {
      @apply text-red-600;
    }
  }

  .list {
    @apply max-h-64 overflow-y-auto;
  }

  .option {
    @apply px-3 py-2 text-sm text-slate-800 cursor-pointer hover:bg-slate-100;
  }

  .main {
    @apply font-medium;
  }

  .secondary {
    @apply ml-1 text-xs text-slate-500;
  }
}
</style>
