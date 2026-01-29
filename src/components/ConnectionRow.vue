<script setup>
import { ref } from "vue";
import FareDetails from "./FareDetails.vue";

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
    <td>{{ connection.departure_station }}</td>
    <td>{{ connection.arrival_station }}</td>
    <td>
      {{
        new Date(connection.departure_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
    </td>
    <td>
      {{
        new Date(connection.arrival_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      }}
    </td>
    <td>{{ connection.duration_in_minutes }} min</td>
    <td>{{ connection.changeovers }}</td>
    <td>
      <div class="price-cell">
        <span>£{{ (connection.fares?.[0]?.price_in_cents ?? 0) / 100 }}</span>
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
