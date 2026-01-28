<script setup>
import { ref } from "vue";
import ConnectionSearchForm from "./components/ConnectionSearchForm.vue";
import ConnectionResultsTable from "./components/ConnectionResultsTable.vue";
import { useConnectionsApi } from "./composables/useConnectionsApi";

const from = ref("Ashchurch For Tewkesbury");
const to = ref("Ash");
const departureAt = ref("2025-12-08");

const { isLoading, error, connections, searchConnections } =
  useConnectionsApi();

function handleSearch() {
  searchConnections({
    from: from.value,
    to: to.value,
    departureAt: departureAt.value,
  });
}
</script>

<template>
  <div class="page">
    <div class="page-inner">
      <h1 class="page-title">Trainline Connections</h1>

      <ConnectionSearchForm
        v-model:from="from"
        v-model:to="to"
        v-model:departureAt="departureAt"
        @search="handleSearch"
      />

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

<style scoped>
.page {
  @apply min-h-screen bg-slate-50;
}

.page-inner {
  @apply max-w-4xl mx-auto px-4 py-8;
}

.page-title {
  @apply text-2xl font-semibold mb-6 text-slate-900;
}

.results-section {
  @apply mt-6;
}
</style>
