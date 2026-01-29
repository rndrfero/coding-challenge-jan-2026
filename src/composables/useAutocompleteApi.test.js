import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAutocompleteApi } from "./useAutocompleteApi";

describe("useAutocompleteApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with empty results", () => {
    const { results, isLoading, error } = useAutocompleteApi();

    expect(results.value).toEqual([]);
    expect(isLoading.value).toBe(false);
    expect(error.value).toBe(null);
  });

  it("clears results when query is empty", async () => {
    const { results, fetchStations } = useAutocompleteApi();

    // Set some results first
    results.value = [{ name: "test" }];

    await fetchStations("");
    expect(results.value).toEqual([]);

    await fetchStations("   ");
    expect(results.value).toEqual([]);
  });

  it("fetches stations successfully", async () => {
    const mockData = {
      searchLocations: [
        { name: "Vienna", translatedName: "Vienna" },
        { name: "Berlin", translatedName: "Berlin" },
      ],
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { results, fetchStations } = useAutocompleteApi();

    await fetchStations("vienna");

    expect(results.value).toEqual(mockData.searchLocations);
    expect(global.fetch).toHaveBeenCalledWith("/api/autocomplete?q=vienna");
  });

  it("sanitizes query before fetching", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ searchLocations: [] }),
    });

    const { fetchStations } = useAutocompleteApi();

    await fetchStations("  vienna  ");

    expect(global.fetch).toHaveBeenCalledWith("/api/autocomplete?q=vienna");
  });

  it("handles API errors", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    const { error, fetchStations } = useAutocompleteApi();

    try {
      await fetchStations("vienna");
    } catch (err) {
      // Error is re-thrown
    }

    expect(error.value).toBe("Failed to fetch stations");
  });

  it("handles network errors", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const { error, fetchStations } = useAutocompleteApi();

    try {
      await fetchStations("vienna");
    } catch (err) {
      // Error is re-thrown
    }

    expect(error.value).toBe("Network error");
  });

  it("handles invalid response format", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ invalid: "data" }),
    });

    const { results, fetchStations } = useAutocompleteApi();

    await fetchStations("vienna");

    expect(results.value).toEqual([]);
  });

  it("handles null searchLocations", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ searchLocations: null }),
    });

    const { results, fetchStations } = useAutocompleteApi();

    await fetchStations("vienna");

    expect(results.value).toEqual([]);
  });

  it("encodes query parameters", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ searchLocations: [] }),
    });

    const { fetchStations } = useAutocompleteApi();

    await fetchStations("new york");

    expect(global.fetch).toHaveBeenCalledWith("/api/autocomplete?q=new%20york");
  });
});
