<script setup>
/**
 * @param {Object} props
 * @param {string} props.sortBy
 * @param {Function} props.onSort
 */
const props = defineProps({
  sortBy: { type: String, required: true },
  onSort: { type: Function, required: true },
});

function sortIndicator(field) {
  if (props.sortBy === field) return "↑";
  if (props.sortBy === `${field}-desc`) return "↓";
  return "";
}

function getSortAriaLabel(field, fieldName = field) {
  if (props.sortBy === field) return `Sort by ${fieldName} ascending`;
  if (props.sortBy === `${field}-desc`)
    return `Sort by ${fieldName} descending`;
  return `Sort by ${fieldName}`;
}
</script>

<template>
  <thead>
    <tr>
      <th>Departure</th>
      <th>Arrival</th>
      <th
        class="sortable"
        @click="onSort('departure_at')"
        role="button"
        :aria-label="getSortAriaLabel('departure_at', 'departure time')"
      >
        Departure Time {{ sortIndicator("departure_at") }}
      </th>
      <th>Arrival Time</th>
      <th
        class="sortable"
        @click="onSort('duration')"
        role="button"
        :aria-label="getSortAriaLabel('duration')"
      >
        Duration {{ sortIndicator("duration") }}
      </th>
      <th>Changeovers</th>
      <th
        class="sortable"
        @click="onSort('price')"
        role="button"
        :aria-label="getSortAriaLabel('price')"
      >
        Price {{ sortIndicator("price") }}
      </th>
    </tr>
  </thead>
</template>

<style scoped>
thead {
  @apply bg-slate-100;
}

th {
  @apply px-3 py-2 text-left text-xs font-semibold text-slate-700;

  &.sortable {
    @apply cursor-pointer hover:bg-slate-200 transition-colors text-blue-600;
  }
}

@media (max-width: 768px) {
  thead {
    @apply hidden;
  }
}
</style>
