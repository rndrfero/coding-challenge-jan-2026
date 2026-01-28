<script setup>
const props = defineProps({
  from: String,
  to: String,
  departureAt: String,
});

const emits = defineEmits([
  "update:from",
  "update:to",
  "update:departureAt",
  "search",
]);

function submit() {
  emits("search");
}
</script>

<template>
  <form class="search-form" @submit.prevent="submit">
    <div class="fields-row">
      <div class="field">
        <label>From</label>
        <input
          type="text"
          :value="from"
          @input="$emit('update:from', $event.target.value)"
        />
      </div>

      <div class="field">
        <label>To</label>
        <input
          type="text"
          :value="to"
          @input="$emit('update:to', $event.target.value)"
        />
      </div>

      <div class="field">
        <label>Departure</label>
        <input
          type="date"
          :value="departureAt"
          @input="$emit('update:departureAt', $event.target.value)"
        />
      </div>
    </div>

    <div class="actions">
      <button class="submit-button" type="submit">Search</button>
    </div>
  </form>
</template>

<style scoped>
.search-form {
  @apply bg-white shadow-sm rounded-lg p-4 flex flex-col gap-4;
}

.fields-row {
  @apply grid gap-4 md:grid-cols-3;
}

.field {
  @apply flex flex-col gap-1;
}

label {
  @apply text-sm font-medium text-slate-700;
}

.search-form input {
  @apply border border-slate-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.actions {
  @apply flex justify-end;
}

.submit-button {
  @apply inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors;
}
</style>
