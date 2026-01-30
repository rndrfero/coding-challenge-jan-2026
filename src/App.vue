<script setup>
import { ref } from "vue";
import ConnectionSearchForm from "./components/ConnectionSearchForm.vue";
import ConnectionResultsTable from "./components/ConnectionResultsTable.vue";
import ErrorBoundary from "./components/ErrorBoundary.vue";
import { useConnectionsApi } from "./composables/useConnectionsApi";
import { normalize } from "./utils/formatters";

const formData = ref({
  from: null,
  to: null,
  departureAt: new Date().toISOString().slice(0, 16),
  onlyDirect: false,
});

const { isFetching, error, connections, searchConnections } =
  useConnectionsApi();

const validationError = ref(null);

function handleSearch() {
  validationError.value = null;

  if (!formData.value.from?.trim()) {
    validationError.value = "Please enter a departure station.";
    return;
  }

  if (!formData.value.to?.trim()) {
    validationError.value = "Please enter an arrival station.";
    return;
  }

  if (normalize(formData.value.from) === normalize(formData.value.to)) {
    validationError.value = "Departure and arrival stations must be different.";
    return;
  }

  if (!formData.value.departureAt) {
    validationError.value = "Please select a departure date and time.";
    return;
  }

  const departureDate = new Date(formData.value.departureAt);
  if (isNaN(departureDate.getTime())) {
    validationError.value = "Please enter a valid departure date and time.";
    return;
  }

  const payload = {
    from: formData.value.from.trim(),
    to: formData.value.to.trim(),
    departureAt: formData.value.departureAt,
    ...(formData.value.onlyDirect && { maxChangeovers: 0 }),
  };

  searchConnections(payload);
}
</script>

<template>
  <div class="page">
    <div class="page-inner">
      <h1 class="page-title">Trainline Connections</h1>

      <ErrorBoundary>
        <ConnectionSearchForm v-model="formData" @search="handleSearch" />

        <div
          v-if="validationError"
          class="validation-error"
          role="alert"
          aria-live="assertive"
        >
          {{ validationError }}
        </div>

        <div class="results-section">
          <ConnectionResultsTable
            :connections="connections"
            :is-fetching="isFetching"
            :error="error"
          />
        </div>
      </ErrorBoundary>
    </div>
  </div>
</template>

<style>
.page {
  @apply min-h-screen bg-slate-50;

  .page-inner {
    @apply max-w-4xl mx-auto px-4 py-8;
  }

  .page-title {
    @apply text-2xl font-semibold mb-6 text-slate-900;
  }

  .results-section {
    @apply mt-6;
  }

  .validation-error {
    @apply mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800;
  }
}
</style>
