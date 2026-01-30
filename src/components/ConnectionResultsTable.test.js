import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ConnectionResultsTable from "./ConnectionResultsTable.vue";
import mockConnectionsData from "../mocks/data/connections.json";

describe("ConnectionResultsTable", () => {
  // Use first 3 connections from real mock data for most tests
  const mockConnections = mockConnectionsData.slice(0, 3);

  it("displays loading state", () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: [],
        isFetching: true,
        error: null,
      },
    });

    expect(wrapper.text()).toContain("Loading connections…");
  });

  it("displays error state", () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: [],
        isFetching: false,
        error: "Failed to fetch",
      },
    });

    expect(wrapper.text()).toContain("Failed to fetch");
  });

  it("displays empty state", () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: [],
        isFetching: false,
        error: null,
      },
    });

    expect(wrapper.text()).toContain("No connections yet. Try a search.");
  });

  it("displays connections", () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: mockConnections,
        isFetching: false,
        error: null,
      },
    });

    expect(wrapper.text()).toContain("Vienna");
    expect(wrapper.text()).toContain("Berlin");
  });

  it("sorts connections by departure time ascending", async () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: mockConnections,
        isFetching: false,
        error: null,
      },
    });

    // Default is already "departure_at", so first click toggles to descending
    // We need to set it to a different field first, then click to get ascending
    wrapper.vm.sortBy = "duration";
    await wrapper.vm.$nextTick();

    // Now click to sort by departure_at (ascending)
    await wrapper.vm.handleSort("departure_at");

    const sorted = wrapper.vm.sortedConnections;
    // Verify sorted order (earliest first)
    expect(new Date(sorted[0].departure_at).getTime()).toBeLessThan(
      new Date(sorted[1].departure_at).getTime(),
    );
    expect(new Date(sorted[1].departure_at).getTime()).toBeLessThan(
      new Date(sorted[2].departure_at).getTime(),
    );
  });

  it("sorts connections by departure time descending", async () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: mockConnections,
        isFetching: false,
        error: null,
      },
    });

    // Default is "departure_at", so first click toggles to descending
    await wrapper.vm.handleSort("departure_at");

    const sorted = wrapper.vm.sortedConnections;
    // Verify sorted order (latest first)
    expect(new Date(sorted[0].departure_at).getTime()).toBeGreaterThan(
      new Date(sorted[1].departure_at).getTime(),
    );
    expect(new Date(sorted[1].departure_at).getTime()).toBeGreaterThan(
      new Date(sorted[2].departure_at).getTime(),
    );
  });

  it("sorts connections by duration ascending", async () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: mockConnections,
        isFetching: false,
        error: null,
      },
    });

    await wrapper.vm.handleSort("duration");

    const sorted = wrapper.vm.sortedConnections;
    // Verify sorted order (shortest first)
    expect(sorted[0].duration_in_minutes).toBeLessThanOrEqual(
      sorted[1].duration_in_minutes,
    );
    expect(sorted[1].duration_in_minutes).toBeLessThanOrEqual(
      sorted[2].duration_in_minutes,
    );
  });

  it("sorts connections by price ascending", async () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: mockConnections,
        isFetching: false,
        error: null,
      },
    });

    await wrapper.vm.handleSort("price");

    const sorted = wrapper.vm.sortedConnections;
    // Verify sorted order (cheapest first)
    const price0 = sorted[0].fares?.[0]?.price_in_cents ?? Infinity;
    const price1 = sorted[1].fares?.[0]?.price_in_cents ?? Infinity;
    const price2 = sorted[2].fares?.[0]?.price_in_cents ?? Infinity;
    expect(price0).toBeLessThanOrEqual(price1);
    expect(price1).toBeLessThanOrEqual(price2);
  });

  it("shows sort indicator for ascending", async () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: mockConnections,
        isFetching: false,
        error: null,
      },
    });

    // Set to a different field first, then click to get ascending
    wrapper.vm.sortBy = "duration";
    await wrapper.vm.$nextTick();
    await wrapper.vm.handleSort("departure_at");

    expect(wrapper.vm.sortIndicator("departure_at")).toBe("↑");
  });

  it("shows sort indicator for descending", async () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: mockConnections,
        isFetching: false,
        error: null,
      },
    });

    // Default is "departure_at", so first click toggles to descending
    await wrapper.vm.handleSort("departure_at");

    expect(wrapper.vm.sortIndicator("departure_at")).toBe("↓");
  });

  it("handles connections without fares", async () => {
    const connectionsWithoutFares = [
      {
        ...mockConnections[0],
        fares: [],
      },
    ];

    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: connectionsWithoutFares,
        isFetching: false,
        error: null,
      },
    });

    await wrapper.vm.handleSort("price");

    const sorted = wrapper.vm.sortedConnections;
    expect(sorted[0].fares).toEqual([]);
    // Price should be Infinity for connections without fares
    expect(sorted[0].fares?.[0]?.price_in_cents).toBeUndefined();
  });
});
