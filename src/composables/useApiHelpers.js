import { computed } from "vue";
import { transform, camelCase, isPlainObject } from "lodash-es";

export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function checkHttpError(response) {
  if (!response.ok) {
    const message = response.statusText || `HTTP ${response.status}`;
    throw new ApiError(`Request failed: ${message}`, response.status);
  }
}

export function createErrorComputed(fetchError) {
  return computed(() => fetchError.value?.message || null);
}

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

export function snakeToCamel(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (!isPlainObject(obj)) return obj;

  return transform(
    obj,
    (result, value, key) => {
      const camelKey = camelCase(key);
      result[camelKey] = snakeToCamel(value);
    },
    {},
  );
}
