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

function getSortAriaLabel(field, fieldName = field) {
  if (sortBy.value === field) return `Sort by ${fieldName} ascending`;
  if (sortBy.value === `${field}-desc`)
    return `Sort by ${fieldName} descending`;
  return `Sort by ${fieldName}`;
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

const sortedConnections = computed(() => {
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
    <div v-if="isLoading" class="loading" aria-live="polite" aria-busy="true">
      Loading connections…
    </div>
    <div v-else-if="error" class="error" aria-live="assertive" role="alert">
      {{ error }}
    </div>
    <div v-else-if="connections.length === 0" class="empty" aria-live="polite">
      No connections yet. Try a search.
    </div>
    <div v-else class="table-wrapper">
      <div class="mobile-sort">
        <label for="sort-select">Sort by:</label>
        <select id="sort-select" v-model="sortBy" class="sort-select">
          <option value="departure_at">Departure Time (earliest)</option>
          <option value="departure_at-desc">Departure Time (latest)</option>
          <option value="duration">Duration (shortest)</option>
          <option value="duration-desc">Duration (longest)</option>
          <option value="price">Price (lowest)</option>
          <option value="price-desc">Price (highest)</option>
        </select>
      </div>

      <table class="results-table">
        <thead>
          <tr>
            <th>Departure</th>
            <th>Arrival</th>
            <th
              class="sortable"
              @click="handleSort('departure_at')"
              role="button"
              :aria-label="getSortAriaLabel('departure_at', 'departure time')"
            >
              Departure Time {{ sortIndicator("departure_at") }}
            </th>
            <th>Arrival Time</th>
            <th
              class="sortable"
              @click="handleSort('duration')"
              role="button"
              :aria-label="getSortAriaLabel('duration')"
            >
              Duration {{ sortIndicator("duration") }}
            </th>
            <th>Changeovers</th>
            <th
              class="sortable"
              @click="handleSort('price')"
              role="button"
              :aria-label="getSortAriaLabel('price')"
            >
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

  .mobile-sort {
    @apply hidden;
  }

  @media (max-width: 768px) {
    .mobile-sort {
      @apply flex items-center gap-2 mb-4;
    }

    .mobile-sort label {
      @apply text-sm font-semibold text-slate-700;
    }

    .sort-select {
      @apply flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white text-slate-800;
    }
    thead {
      @apply hidden;
    }

    tbody tr.connection-row {
      @apply block mb-4 rounded-lg border border-slate-200 bg-white shadow-sm;
      padding: 12px;
    }

    tbody tr.connection-row td {
      @apply block text-right border-b border-slate-100;
      padding: 8px 0;
    }

    tbody tr.connection-row td::before {
      content: attr(data-label);
      @apply float-left font-semibold text-slate-600;
    }

    tbody tr.connection-row td:last-child {
      @apply border-b-0;
    }
  }
}
</style>
