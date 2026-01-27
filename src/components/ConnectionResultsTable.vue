<script setup>
const props = defineProps({
  connections: { type: Array, default: () => [] },
  isLoading: Boolean,
  error: String,
});
</script>

<template>
  <div class="bg-white shadow-sm rounded-lg p-4">
    <div v-if="isLoading" class="text-sm text-slate-600">Loading connections…</div>
    <div v-else-if="error" class="text-sm text-red-600">{{ error }}</div>
    <div v-else-if="connections.length === 0" class="text-sm text-slate-600">
      No connections yet. Try a search.
    </div>
    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead class="bg-slate-100">
          <tr>
            <th class="table-th">Departure</th>
            <th class="table-th">Arrival</th>
            <th class="table-th">Departure Time</th>
            <th class="table-th">Arrival Time</th>
            <th class="table-th">Duration</th>
            <th class="table-th">Changeovers</th>
            <th class="table-th">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, index) in connections" :key="index" class="border-b last:border-0">
            <td class="table-td">{{ c.departure_station }}</td>
            <td class="table-td">{{ c.arrival_station }}</td>
            <td class="table-td">
              {{
                new Date(c.departure_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </td>
            <td class="table-td">
              {{
                new Date(c.arrival_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              }}
            </td>
            <td class="table-td">{{ c.duration_in_minutes }} min</td>
            <td class="table-td">{{ c.changeovers }}</td>
            <td class="table-td">
              £{{ (c.fares?.[0]?.price_in_cents ?? 0) / 100 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-th {
  @apply px-3 py-2 text-left text-xs font-semibold text-slate-700;
}
.table-td {
  @apply px-3 py-2 text-slate-800 whitespace-nowrap;
}
</style>

