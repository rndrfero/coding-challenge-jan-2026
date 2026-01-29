import { ref } from "vue";

export function useApiRequest() {
  const isLoading = ref(false);
  const error = ref(null);

  async function executeRequest(requestFn) {
    isLoading.value = true;
    error.value = null;

    try {
      return await requestFn();
    } catch (err) {
      error.value = err.message || "Unknown error";
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return { isLoading, error, executeRequest };
}
