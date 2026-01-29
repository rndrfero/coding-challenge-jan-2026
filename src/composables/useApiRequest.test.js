import { describe, it, expect, vi, beforeEach } from "vitest";
import { useApiRequest } from "./useApiRequest";

describe("useApiRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with loading false and error null", () => {
    const { isLoading, error } = useApiRequest();

    expect(isLoading.value).toBe(false);
    expect(error.value).toBe(null);
  });

  it("manages loading state during request", async () => {
    const { isLoading, executeRequest } = useApiRequest();

    const promise = executeRequest(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return "success";
    });

    expect(isLoading.value).toBe(true);
    await promise;
    expect(isLoading.value).toBe(false);
  });

  it("clears error at start of request", async () => {
    const { error, executeRequest } = useApiRequest();

    // Set an error first
    error.value = "Previous error";

    await executeRequest(async () => {
      return "success";
    });

    expect(error.value).toBe(null);
  });

  it("sets error on failure", async () => {
    const { error, executeRequest } = useApiRequest();

    const testError = new Error("Test error");

    try {
      await executeRequest(async () => {
        throw testError;
      });
    } catch (err) {
      // Error is re-thrown
    }

    expect(error.value).toBe("Test error");
  });

  it("sets error message for errors without message", async () => {
    const { error, executeRequest } = useApiRequest();

    try {
      await executeRequest(async () => {
        throw new Error();
      });
    } catch (err) {
      // Error is re-thrown
    }

    expect(error.value).toBe("Unknown error");
  });

  it("returns result from request function", async () => {
    const { executeRequest } = useApiRequest();

    const result = await executeRequest(async () => {
      return { data: "test" };
    });

    expect(result).toEqual({ data: "test" });
  });

  it("re-throws error after setting error state", async () => {
    const { error, executeRequest } = useApiRequest();

    const testError = new Error("Test error");

    await expect(
      executeRequest(async () => {
        throw testError;
      }),
    ).rejects.toThrow("Test error");

    expect(error.value).toBe("Test error");
  });

  it("sets loading to false even if request fails", async () => {
    const { isLoading, executeRequest } = useApiRequest();

    try {
      await executeRequest(async () => {
        throw new Error("Test error");
      });
    } catch (err) {
      // Error is re-thrown
    }

    expect(isLoading.value).toBe(false);
  });
});
