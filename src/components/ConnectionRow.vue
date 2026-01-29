<script setup>
import { ref } from "vue";
import FareDetails from "./FareDetails.vue";
import { formatTime, formatPrice } from "../utils/formatters";

const props = defineProps({
  connection: {
    type: Object,
    required: true,
  },
});

const isExpanded = ref(false);

function toggle() {
  isExpanded.value = !isExpanded.value;
}
</script>

<template>
  <tr class="connection-row" @click="toggle">
    <td data-label="Departure">{{ connection.departure_station }}</td>
    <td data-label="Arrival">{{ connection.arrival_station }}</td>
    <td data-label="Departure Time">
      {{ formatTime(connection.departure_at) }}
    </td>
    <td data-label="Arrival Time">{{ formatTime(connection.arrival_at) }}</td>
    <td data-label="Duration">{{ connection.duration_in_minutes }} min</td>
    <td data-label="Changeovers">{{ connection.changeovers }}</td>
    <td data-label="Price">
      <div class="price-cell">
        <span
          >{{ connection.fares?.[0]?.currency }}
          {{ formatPrice(connection.fares?.[0]?.price_in_cents) }}</span
        >
        <span v-if="connection.fares?.length > 1" class="expand-indicator">
          {{ isExpanded ? "−" : "+" }} {{ connection.fares.length }} fares
        </span>
      </div>
    </td>
  </tr>
  <tr v-if="isExpanded" class="fare-row">
    <td colspan="7" class="fare-cell">
      <FareDetails :fares="connection.fares || []" />
    </td>
  </tr>
</template>

<style>
.connection-row {
  @apply cursor-pointer hover:bg-slate-50 transition-colors;
}

.price-cell {
  @apply flex items-center gap-2;
}

.price-cell > span:first-child {
  @apply text-lg font-semibold text-slate-900;
}

.expand-indicator {
  @apply text-xs text-blue-600 font-medium;
}

.fare-row {
  @apply border-b;
}

.fare-cell {
  @apply p-0 overflow-hidden;
  animation: slideDown 0.3s ease-out;
}

@media (max-width: 768px) {
  .price-cell {
    @apply flex-col items-end gap-1;
  }

  .fare-row {
    display: block;
    margin: -16px 0 0 0;
    padding: 0 12px 12px 12px;
  }

  .fare-cell {
    padding: 0;
  }
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
}
</style>
