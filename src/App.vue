<script setup>
import { ref } from 'vue';
import ConnectionSearchForm from './components/ConnectionSearchForm.vue';
import ConnectionResultsTable from './components/ConnectionResultsTable.vue';
import { useConnectionsApi } from './composables/useConnectionsApi';

const from = ref('Ashchurch For Tewkesbury');
const to = ref('Ash');
const departureAt = ref('2025-12-08');

const { isLoading, error, connections, searchConnections } = useConnectionsApi();

function handleSearch() {
  searchConnections({
    from: from.value,
    to: to.value,
    departureAt: departureAt.value,
  });
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-semibold mb-6 text-slate-900">Trainline Connections</h1>

      <ConnectionSearchForm
        v-model:from="from"
        v-model:to="to"
        v-model:departureAt="departureAt"
        @search="handleSearch"
      />

      <ConnectionResultsTable
        class="mt-6"
        :connections="connections"
        :is-loading="isLoading"
        :error="error"
      />
    </div>
  </div>
</template>

