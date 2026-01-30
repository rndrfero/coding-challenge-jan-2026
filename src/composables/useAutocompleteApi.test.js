import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useAutocompleteApi } from "./useAutocompleteApi";
import { createMockResponse } from "./useApiHelpers";

describe("useAutocompleteApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with empty results", () => {
    const { results, isFetching, error } = useAutocompleteApi();

    expect(results.value).toEqual([]);
    expect(isFetching.value).toBe(false);
    expect(error.value).toBe(null);
  });

  it("clears results when query is empty", async () => {
    const { results, fetchStations } = useAutocompleteApi();

    results.value = [{ name: "test" }];

    await fetchStations("");
    expect(results.value).toEqual([]);

    await fetchStations("   ");
    expect(results.value).toEqual([]);
  });

  it("fetches stations successfully", async () => {
    const mockData = {
      searchLocations: [
        {
          name: "Vienna",
          translatedName: "Vienna",
          countryCode: "AT",
          code: "urn:test:vienna",
          score: 0.9,
          longitude: 16.3738,
          latitude: 48.2082,
          extraInfo: { attributes: [] },
          locationType: "city",
          defaultLanguage: "en",
          timezone: "Europe/Vienna",
          connections: [],
        },
        {
          name: "Berlin",
          translatedName: "Berlin",
          countryCode: "DE",
          code: "urn:test:berlin",
          score: 0.8,
          longitude: 13.405,
          latitude: 52.52,
          extraInfo: { attributes: [] },
          locationType: "city",
          defaultLanguage: "en",
          timezone: "Europe/Berlin",
          connections: [],
        },
      ],
    };

    global.fetch.mockResolvedValueOnce(
      createMockResponse(mockData, { ok: true }),
    );

    const { results, fetchStations } = useAutocompleteApi();

    await fetchStations("vienna");

    expect(results.value).toEqual(mockData.searchLocations);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/autocomplete?q=vienna",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("sanitizes query before fetching", async () => {
    global.fetch.mockResolvedValueOnce(
      createMockResponse({ searchLocations: [] }, { ok: true }),
    );

    const { fetchStations } = useAutocompleteApi();

    await fetchStations("  vienna  ");

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/autocomplete?q=vienna",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("handles API errors", async () => {
    global.fetch.mockResolvedValueOnce(createMockResponse(null, { ok: false }));

    const { error, fetchStations } = useAutocompleteApi();

    try {
      await fetchStations("vienna");
    } catch (err) {
      // Expected
    }

    expect(error.value).toBe("Failed to fetch stations");
  });

  it("handles network errors", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const { error, fetchStations } = useAutocompleteApi();

    try {
      await fetchStations("vienna");
    } catch (err) {
      // Expected
    }

    expect(error.value).toBe("Network error");
  });

  it("handles invalid response format", async () => {
    global.fetch.mockResolvedValueOnce(
      createMockResponse({ invalid: "data" }, { ok: true }),
    );

    const { error, fetchStations } = useAutocompleteApi();

    try {
      await fetchStations("vienna");
    } catch (err) {
      // Expected
    }

    expect(error.value).toBe("Invalid response format");
  });

  it("handles null searchLocations", async () => {
    global.fetch.mockResolvedValueOnce(
      createMockResponse({ searchLocations: null }, { ok: true }),
    );

    const { error, fetchStations } = useAutocompleteApi();

    try {
      await fetchStations("vienna");
    } catch (err) {
      // Expected
    }

    expect(error.value).toBe("Invalid response format");
  });

  it("encodes query parameters", async () => {
    global.fetch.mockResolvedValueOnce(
      createMockResponse({ searchLocations: [] }, { ok: true }),
    );

    const { fetchStations } = useAutocompleteApi();

    await fetchStations("new york");

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/autocomplete?q=new%20york",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("cancels previous request when new request is made", async () => {
    const mockData1 = {
      searchLocations: [
        {
          name: "Vienna",
          translatedName: "Vienna",
          countryCode: "AT",
          code: "urn:test:vienna",
          score: 0.9,
          longitude: 16.3738,
          latitude: 48.2082,
          extraInfo: { attributes: [] },
          locationType: "city",
          defaultLanguage: "en",
          timezone: "Europe/Vienna",
          connections: [],
        },
      ],
    };
    const mockData2 = {
      searchLocations: [
        {
          name: "Berlin",
          translatedName: "Berlin",
          countryCode: "DE",
          code: "urn:test:berlin",
          score: 0.8,
          longitude: 13.405,
          latitude: 52.52,
          extraInfo: { attributes: [] },
          locationType: "city",
          defaultLanguage: "en",
          timezone: "Europe/Berlin",
          connections: [],
        },
      ],
    };

    let abortSignal1 = null;
    let abortSignal2 = null;

    global.fetch
      .mockImplementationOnce(async (url, options) => {
        abortSignal1 = options.signal;
        await new Promise((resolve) => setTimeout(resolve, 100));
        return createMockResponse(mockData1, { ok: true });
      })
      .mockImplementationOnce((url, options) => {
        abortSignal2 = options.signal;
        return Promise.resolve(createMockResponse(mockData2, { ok: true }));
      });

    const { results, fetchStations } = useAutocompleteApi();

    const promise1 = fetchStations("vienna");
    const promise2 = fetchStations("berlin");

    await promise2;

    expect(abortSignal1.aborted).toBe(true);
    expect(results.value).toEqual(mockData2.searchLocations);
    await promise1;
    expect(results.value).toEqual(mockData2.searchLocations);
  });

  it("cancels and restarts identical requests", async () => {
    const mockData = {
      searchLocations: [
        {
          name: "Vienna",
          translatedName: "Vienna",
          countryCode: "AT",
          code: "urn:test:vienna",
          score: 0.9,
          longitude: 16.3738,
          latitude: 48.2082,
          extraInfo: { attributes: [] },
          locationType: "city",
          defaultLanguage: "en",
          timezone: "Europe/Vienna",
          connections: [],
        },
      ],
    };

    global.fetch.mockResolvedValue(createMockResponse(mockData, { ok: true }));

    const { fetchStations } = useAutocompleteApi();

    await Promise.all([fetchStations("vienna"), fetchStations("vienna")]);

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("ignores stale responses when query changes", async () => {
    const mockData1 = {
      searchLocations: [
        {
          name: "Vienna",
          translatedName: "Vienna",
          countryCode: "AT",
          code: "urn:test:vienna",
          score: 0.9,
          longitude: 16.3738,
          latitude: 48.2082,
          extraInfo: { attributes: [] },
          locationType: "city",
          defaultLanguage: "en",
          timezone: "Europe/Vienna",
          connections: [],
        },
      ],
    };
    const mockData2 = {
      searchLocations: [
        {
          name: "Berlin",
          translatedName: "Berlin",
          countryCode: "DE",
          code: "urn:test:berlin",
          score: 0.8,
          longitude: 13.405,
          latitude: 52.52,
          extraInfo: { attributes: [] },
          locationType: "city",
          defaultLanguage: "en",
          timezone: "Europe/Berlin",
          connections: [],
        },
      ],
    };

    global.fetch
      .mockImplementationOnce(async (url, options) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return createMockResponse(mockData1, { ok: true });
      })
      .mockImplementationOnce((url, options) => {
        return Promise.resolve(createMockResponse(mockData2, { ok: true }));
      });

    const { results, fetchStations } = useAutocompleteApi();

    const promise1 = fetchStations("vienna");
    const promise2 = fetchStations("berlin");

    await promise2;
    expect(results.value).toEqual(mockData2.searchLocations);

    await promise1;
    expect(results.value).toEqual(mockData2.searchLocations);
  });

  it("handles aborted requests gracefully", async () => {
    global.fetch.mockImplementationOnce((url, options) => {
      return Promise.reject(new DOMException("Aborted", "AbortError"));
    });

    const { error, fetchStations } = useAutocompleteApi();

    try {
      await fetchStations("vienna");
    } catch (err) {
      // Expected
    }

    expect(error.value).toBe(null);
  });

  it("ignores stale response even if currentQuery changes during json parsing", async () => {
    const mockData1 = {
      searchLocations: [
        {
          name: "Vienna",
          translatedName: "Vienna",
          countryCode: "AT",
          code: "urn:test:vienna",
          score: 0.9,
          longitude: 16.3738,
          latitude: 48.2082,
          extraInfo: { attributes: [] },
          locationType: "city",
          defaultLanguage: "en",
          timezone: "Europe/Vienna",
          connections: [],
        },
      ],
    };
    const mockData2 = {
      searchLocations: [
        {
          name: "Berlin",
          translatedName: "Berlin",
          countryCode: "DE",
          code: "urn:test:berlin",
          score: 0.8,
          longitude: 13.405,
          latitude: 52.52,
          extraInfo: { attributes: [] },
          locationType: "city",
          defaultLanguage: "en",
          timezone: "Europe/Berlin",
          connections: [],
        },
      ],
    };

    let jsonResolve1 = null;

    global.fetch
      .mockImplementationOnce(async (url, options) => {
        await new Promise((resolve) => {
          jsonResolve1 = resolve;
        });
        return createMockResponse(mockData1, { ok: true });
      })
      .mockImplementationOnce((url, options) => {
        return Promise.resolve(createMockResponse(mockData2, { ok: true }));
      });

    const { results, fetchStations } = useAutocompleteApi();

    const promise1 = fetchStations("vienna");

    await new Promise((resolve) => setTimeout(resolve, 10));

    const promise2 = fetchStations("berlin");

    await promise2;
    expect(results.value).toEqual(mockData2.searchLocations);

    if (jsonResolve1) jsonResolve1();
    await promise1;

    expect(results.value).toEqual(mockData2.searchLocations);
  });

  it("ignores stale error responses when query changes", async () => {
    global.fetch
      .mockImplementationOnce(async (url, options) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const response = createMockResponse({}, { ok: true });
        response.json = async () => {
          throw new Error("Parse error");
        };
        return response;
      })
      .mockImplementationOnce((url, options) => {
        return Promise.resolve(
          createMockResponse({ searchLocations: [] }, { ok: true }),
        );
      });

    const { error, results, fetchStations } = useAutocompleteApi();

    const promise1 = fetchStations("vienna");
    const promise2 = fetchStations("berlin");

    await promise2;
    expect(error.value).toBe(null);
    expect(results.value).toEqual([]);

    try {
      await promise1;
    } catch (err) {
      // Expected
    }

    expect(error.value).toBe(null);
  });

  it("handles multiple rapid requests correctly", async () => {
    const createLocation = (name) => ({
      name,
      translatedName: name,
      countryCode: "XX",
      code: `urn:test:${name.toLowerCase()}`,
      score: 0.9,
      longitude: 0,
      latitude: 0,
      extraInfo: { attributes: [] },
      locationType: "city",
      defaultLanguage: "en",
      timezone: "UTC",
      connections: [],
    });
    const mockData1 = { searchLocations: [createLocation("A")] };
    const mockData2 = { searchLocations: [createLocation("B")] };
    const mockData3 = { searchLocations: [createLocation("C")] };

    const abortSignals = [];

    global.fetch
      .mockImplementationOnce(async (url, options) => {
        abortSignals.push(options.signal);
        await new Promise((resolve) => setTimeout(resolve, 50));
        return createMockResponse(mockData1, { ok: true });
      })
      .mockImplementationOnce(async (url, options) => {
        abortSignals.push(options.signal);
        await new Promise((resolve) => setTimeout(resolve, 50));
        return createMockResponse(mockData2, { ok: true });
      })
      .mockImplementationOnce((url, options) => {
        abortSignals.push(options.signal);
        return Promise.resolve(createMockResponse(mockData3, { ok: true }));
      });

    const { results, fetchStations } = useAutocompleteApi();

    const promise1 = fetchStations("a");
    const promise2 = fetchStations("b");
    const promise3 = fetchStations("c");

    await promise3;

    expect(abortSignals[0].aborted).toBe(true);
    expect(abortSignals[1].aborted).toBe(true);
    expect(abortSignals[2].aborted).toBe(false);

    expect(results.value).toEqual(mockData3.searchLocations);

    await Promise.all([promise1, promise2]);

    expect(results.value).toEqual(mockData3.searchLocations);
  });
});
