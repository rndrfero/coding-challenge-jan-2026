import { computed } from "vue";

export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Throws ApiError if response is not ok
 */
export function checkHttpError(response) {
  if (!response.ok) {
    const message = response.statusText || `HTTP ${response.status}`;
    throw new ApiError(`Request failed: ${message}`, response.status);
  }
}

/**
 * Transforms VueUse fetchError to string | null format
 */
export function createErrorComputed(fetchError) {
  return computed(() => fetchError.value?.message || null);
}

/**
 * Creates a proper Response object for VueUse useFetch testing
 * VueUse requires Response objects with clone() method
 */
export function createMockResponse(data, options = {}) {
  const response = new Response(JSON.stringify(data), {
    status: options.status || (options.ok === false ? 400 : 200),
    statusText:
      options.statusText || (options.ok === false ? "Bad Request" : "OK"),
    headers: { "Content-Type": "application/json" },
  });
  if (options.ok !== undefined) {
    Object.defineProperty(response, "ok", {
      value: options.ok,
      writable: false,
    });
  }
  return response;
}
