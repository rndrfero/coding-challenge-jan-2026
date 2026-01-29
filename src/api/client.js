/**
 * Simple API client abstraction
 * KISS approach - just wraps fetch with common patterns
 */

export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class ApiClient {
  constructor(baseUrl = "") {
    this.baseUrl = baseUrl;
  }

  async get(url, options = {}) {
    return this.request(url, { ...options, method: "GET" });
  }

  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    });
  }

  async request(url, options = {}) {
    const fullUrl = `${this.baseUrl}${url}`;
    const { signal, ...fetchOptions } = options;

    const res = await fetch(fullUrl, {
      ...fetchOptions,
      signal,
    });

    if (!res.ok) {
      const message = res.statusText || `HTTP ${res.status}`;
      throw new ApiError(`Request failed: ${message}`, res.status);
    }

    return res;
  }
}

// Default client instance
export const apiClient = new ApiClient();
