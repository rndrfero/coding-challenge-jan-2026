<script setup>
import { ref, computed } from "vue";
import ConnectionRow from "./ConnectionRow.vue";
import TableHeader from "./TableHeader.vue";
import MobileSortDropdown from "./MobileSortDropdown.vue";

/**
 * @typedef {import("../schemas/connections.js").Connection} Connection
 */

/**
 * @param {Object} props
 * @param {Connection[]} props.connections
 * @param {boolean} props.isFetching
 * @param {string} [props.error]
 */

const props = defineProps({
  connections: { type: Array, default: [] },
  isFetching: Boolean,
  error: String,
});

const sortBy = ref("departure_at");

function handleSort(field) {
  if (sortBy.value === field) {
    sortBy.value = `${field}-desc`;
  } else {
    sortBy.value = field;
  }
}

function getValue(connection, field) {
  if (field === "departure_at") {
    return new Date(connection.departure_at).getTime();
  }
  if (field === "duration") {
    return connection.duration_in_minutes;
  }
  if (field === "price") {
    return connection.fares?.[0]?.price_in_cents ?? Infinity;
  }
  return 0;
}

// Memoized by Vue's computed - only recalculates when connections or sortBy changes
const sortedConnections = computed(() => {
  if (props.connections.length <= 1) {
    return props.connections;
  }

  const [field, direction] = sortBy.value.split("-");

  const sorted = [...props.connections].sort((a, b) => {
    const aVal = getValue(a, field);
    const bVal = getValue(b, field);
    return direction === "desc" ? bVal - aVal : aVal - bVal;
  });

  return sorted;
});
</script>

<template>
  <div class="connections-results-table">
    <div v-if="isFetching" class="loading" aria-live="polite" aria-busy="true">
      Loading connections…
    </div>
    <div v-else-if="error" class="error" aria-live="assertive" role="alert">
      {{ error }}
    </div>
    <div v-else-if="connections.length === 0" class="empty" aria-live="polite">
      No connections yet. Try a search.
    </div>
    <div v-else class="table-wrapper">
      <MobileSortDropdown v-model="sortBy" />

      <table class="results-table">
        <TableHeader :sortBy="sortBy" :onSort="handleSort" />
        <tbody>
          <ConnectionRow
            v-for="connection in sortedConnections"
            :key="`${connection.departure_at}-${connection.arrival_at}-${connection.departure_station}-${connection.arrival_station}`"
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

  tbody tr {
    @apply border-b;
  }

  td {
    @apply px-3 py-2 text-slate-800 whitespace-nowrap;
  }
}
</style>
