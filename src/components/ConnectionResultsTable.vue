<script setup>
import { ref, computed } from "vue";
import ConnectionRow from "./ConnectionRow.vue";

const props = defineProps({
  connections: { type: Array, default: [] },
  isLoading: Boolean,
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

function sortIndicator(field) {
  if (sortBy.value === field) return "↑";
  if (sortBy.value === `${field}-desc`) return "↓";
  return "";
}

const sortedConnections = computed(() => {
  const [field, direction] = sortBy.value.split("-");
  const sorted = [...props.connections].sort((a, b) => {
    let aVal, bVal;

    if (field === "departure_at") {
      aVal = new Date(a.departure_at).getTime();
      bVal = new Date(b.departure_at).getTime();
    } else if (field === "duration") {
      aVal = a.duration_in_minutes;
      bVal = b.duration_in_minutes;
    } else if (field === "price") {
      aVal = a.fares?.[0]?.price_in_cents ?? Infinity;
      bVal = b.fares?.[0]?.price_in_cents ?? Infinity;
    }

    return direction === "desc" ? bVal - aVal : aVal - bVal;
  });

  return sorted;
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
            <th class="sortable" @click="handleSort('departure_at')">
              Departure Time {{ sortIndicator("departure_at") }}
            </th>
            <th>Arrival Time</th>
            <th class="sortable" @click="handleSort('duration')">
              Duration {{ sortIndicator("duration") }}
            </th>
            <th>Changeovers</th>
            <th class="sortable" @click="handleSort('price')">
              Price {{ sortIndicator("price") }}
            </th>
          </tr>
        </thead>
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

  thead {
    @apply bg-slate-100;
  }

  tbody tr {
    @apply border-b;
  }

  th {
    @apply px-3 py-2 text-left text-xs font-semibold text-slate-700;

    &.sortable {
      @apply cursor-pointer hover:bg-slate-200 transition-colors text-blue-600;
    }
  }

  td {
    @apply px-3 py-2 text-slate-800 whitespace-nowrap;
  }
}
</style>
