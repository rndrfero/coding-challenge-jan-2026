<script setup>
import { computed } from "vue";
import AutocompleteField from "./AutocompleteField.vue";

/**
 * @typedef {Object} SearchFormValue
 * @property {string} [from]
 * @property {string} [to]
 * @property {string} [departureAt]
 * @property {boolean} [onlyDirect]
 */

/**
 * @param {Object} props
 * @param {SearchFormValue} props.modelValue
 */
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(["update:modelValue", "search"]);

function createFieldComputed(field) {
  return computed({
    get: () => props.modelValue[field],
    set: (value) =>
      emits("update:modelValue", {
        ...props.modelValue,
        [field]: value,
      }),
  });
}

const fromValue = createFieldComputed("from");
const toValue = createFieldComputed("to");
const departureAtValue = createFieldComputed("departureAt");
const onlyDirectValue = createFieldComputed("onlyDirect");

function submit() {
  emits("search");
}
</script>

<template>
  <form class="connection-search-form" @submit.prevent="submit">
    <div class="fields-row">
      <div class="field">
        <AutocompleteField
          label="From"
          v-model="fromValue"
          placeholder="Start typing a city or station"
        />
      </div>

      <div class="field">
        <AutocompleteField
          label="To"
          v-model="toValue"
          placeholder="Start typing a city or station"
        />
      </div>

      <div class="field">
        <label>Departure</label>
        <input type="datetime-local" v-model="departureAtValue" />
      </div>
    </div>

    <div class="options-row">
      <label class="option">
        <input type="checkbox" v-model="onlyDirectValue" />
        Show only direct connections (0 changeovers)
      </label>
    </div>

    <div class="actions">
      <button
        class="submit-button"
        type="submit"
        aria-label="Search for train connections"
      >
        Search
      </button>
    </div>
  </form>
</template>

<style>
.connection-search-form {
  @apply bg-white shadow-sm rounded-lg p-4 flex flex-col gap-4;

  .fields-row {
    @apply grid gap-4 md:grid-cols-3;
  }

  .field {
    @apply flex flex-col gap-1;
  }

  label {
    @apply text-sm font-medium text-slate-700;
  }

  .options-row {
    @apply flex items-center;

    .option {
      @apply inline-flex items-center gap-2 text-sm text-slate-700;

      input[type="checkbox"] {
        @apply w-4 h-4;
      }
    }
  }

  input {
    @apply border border-slate-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  }

  .actions {
    @apply flex justify-end;
  }

  .submit-button {
    @apply inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors;
  }
}
</style>
