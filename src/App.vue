<script setup>
import { ref } from "vue";
import ConnectionSearchForm from "./components/ConnectionSearchForm.vue";
import ConnectionResultsTable from "./components/ConnectionResultsTable.vue";
import { useConnectionsApi } from "./composables/useConnectionsApi";

const formData = ref({
  from: "",
  to: "",
  departureAt: "2025-12-08",
  onlyDirect: false,
});

const { isLoading, error, connections, searchConnections } =
  useConnectionsApi();

function handleSearch() {
  const payload = {
    from: formData.value.from,
    to: formData.value.to,
    departureAt: formData.value.departureAt,
  };

  if (formData.value.onlyDirect) {
    payload.maxChangeovers = 0;
  }

  searchConnections(payload);
}
</script>

<template>
  <div class="page">
    <div class="page-inner">
      <h1 class="page-title">Trainline Connections</h1>

      <ConnectionSearchForm v-model="formData" @search="handleSearch" />

      <div class="results-section">
        <ConnectionResultsTable
          :connections="connections"
          :is-loading="isLoading"
          :error="error"
        />
      </div>
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
}
</style>
