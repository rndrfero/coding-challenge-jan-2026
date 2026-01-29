<script setup>
import ConnectionRow from "./ConnectionRow.vue";

const props = defineProps({
  connections: { type: Array, default: () => [] },
  isLoading: Boolean,
  error: String,
});
</script>

<template>
  <div class="connections-results-table">
    <div v-if="isLoading" class="loading">Loading connections…</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="connections.length === 0" class="empty">
      No connections yet. Try a search.
    </div>
    <div v-else class="table-wrapper">
      <table class="results-table">
        <thead>
          <tr>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Duration</th>
            <th>Changeovers</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <ConnectionRow
            v-for="(connection, index) in connections"
            :key="index"
            :connection="connection"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.connections-results-table {
  @apply bg-white shadow-sm rounded-lg p-4;

  .loading,
  .error,
  .empty {
    @apply text-sm;
  }

  .loading,
  .empty {
    @apply text-slate-600;
  }

  .error {
    @apply text-red-600;
  }

  .table-wrapper {
    @apply overflow-x-auto;
  }

  .results-table {
    @apply min-w-full text-sm;
  }

  thead {
    @apply bg-slate-100;
  }

  tbody tr {
    @apply border-b;
  }

  th {
    @apply px-3 py-2 text-left text-xs font-semibold text-slate-700;
  }

  td {
    @apply px-3 py-2 text-slate-800 whitespace-nowrap;
  }
}
</style>
