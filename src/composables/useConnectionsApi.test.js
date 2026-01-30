import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useConnectionsApi } from "./useConnectionsApi";
import { createMockResponse } from "./useApiHelpers";

describe("useConnectionsApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes with empty connections", () => {
    const { connections, isFetching, error } = useConnectionsApi();

    expect(connections.value).toEqual([]);
    expect(isFetching.value).toBe(false);
    expect(error.value).toBe(null);
  });

  it("searches connections successfully", async () => {
    const mockConnections = [
      {
        departure_station: "Vienna",
        arrival_station: "Berlin",
        departure_at: "2025-12-08T08:00:00",
        arrival_at: "2025-12-08T12:30:00",
        duration_in_minutes: 270,
        changeovers: 1,
        products: ["train"],
        fares: [
          {
            name: "Standard",
            price_in_cents: 4999,
            currency: "EUR",
            comfort_class: 2,
          },
        ],
      },
    ];

    global.fetch.mockResolvedValueOnce(
      createMockResponse(mockConnections, { ok: true }),
    );

    const { connections, searchConnections } = useConnectionsApi();

    await searchConnections({
      from: "Vienna",
      to: "Berlin",
      departureAt: "2025-12-08T08:00",
    });

    expect(connections.value).toEqual(mockConnections);
    expect(global.fetch).toHaveBeenCalledWith("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Vienna",
        to: "Berlin",
        departureAt: "2025-12-08T08:00",
      }),
      signal: expect.any(AbortSignal),
    });
  });

  it("includes maxChangeovers in request when provided", async () => {
    global.fetch.mockResolvedValueOnce(createMockResponse([], { ok: true }));

    const { searchConnections } = useConnectionsApi();

    await searchConnections({
      from: "Vienna",
      to: "Berlin",
      departureAt: "2025-12-08T08:00",
      maxChangeovers: 0,
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Vienna",
        to: "Berlin",
        departureAt: "2025-12-08T08:00",
        maxChangeovers: 0,
      }),
      signal: expect.any(AbortSignal),
    });
  });

  it("handles API errors", async () => {
    global.fetch.mockResolvedValueOnce(createMockResponse(null, { ok: false }));

    const { error, searchConnections } = useConnectionsApi();

    try {
      await searchConnections({
        from: "Vienna",
        to: "Berlin",
        departureAt: "2025-12-08T08:00",
      });
    } catch (err) {
      // Error is re-thrown
    }

    expect(error.value).toBe("Failed to fetch connections");
  });

  it("handles network errors", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    const { error, searchConnections } = useConnectionsApi();

    try {
      await searchConnections({
        from: "Vienna",
        to: "Berlin",
        departureAt: "2025-12-08T08:00",
      });
    } catch (err) {
      // Error is re-thrown
    }

    expect(error.value).toBe("Network error");
  });

  it("manages loading state", async () => {
    global.fetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(createMockResponse([], { ok: true })), 10),
        ),
    );

    const { isFetching, searchConnections } = useConnectionsApi();

    const promise = searchConnections({
      from: "Vienna",
      to: "Berlin",
      departureAt: "2025-12-08T08:00",
    });

    expect(isFetching.value).toBe(true);
    await promise;
    expect(isFetching.value).toBe(false);
  });

  it("handles empty results", async () => {
    global.fetch.mockResolvedValueOnce(createMockResponse([], { ok: true }));

    const { connections, searchConnections } = useConnectionsApi();

    await searchConnections({
      from: "Vienna",
      to: "Berlin",
      departureAt: "2026-06-15T08:00",
    });

    expect(connections.value).toEqual([]);
  });

  it("validates response is an array", async () => {
    global.fetch.mockResolvedValueOnce(
      createMockResponse({ error: "Invalid format" }, { ok: true }),
    );

    const { error, searchConnections } = useConnectionsApi();

    try {
      await searchConnections({
        from: "Vienna",
        to: "Berlin",
        departureAt: "2026-06-15T08:00",
      });
    } catch (err) {
      // Error is re-thrown
    }

    expect(error.value).toBe("Invalid response format: expected array");
  });
});
