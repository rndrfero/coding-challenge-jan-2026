import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ConnectionResultsTable from "./ConnectionResultsTable.vue";
import mockConnectionsData from "../mocks/data/connections.json";
import { snakeToCamel } from "../composables/useApiHelpers";
import { ConnectionsResponseSchema } from "../schemas/connections";

describe("ConnectionResultsTable", () => {
  const mockConnections = snakeToCamel(
    ConnectionsResponseSchema.parse(mockConnectionsData.slice(0, 3)),
  );

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

    wrapper.vm.sortBy = "duration";
    await wrapper.vm.$nextTick();

    await wrapper.vm.handleSort("departureAt");

    const sorted = wrapper.vm.sortedConnections;
    expect(new Date(sorted[0].departureAt).getTime()).toBeLessThan(
      new Date(sorted[1].departureAt).getTime(),
    );
    expect(new Date(sorted[1].departureAt).getTime()).toBeLessThan(
      new Date(sorted[2].departureAt).getTime(),
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

    await wrapper.vm.handleSort("departureAt");

    const sorted = wrapper.vm.sortedConnections;
    expect(new Date(sorted[0].departureAt).getTime()).toBeGreaterThan(
      new Date(sorted[1].departureAt).getTime(),
    );
    expect(new Date(sorted[1].departureAt).getTime()).toBeGreaterThan(
      new Date(sorted[2].departureAt).getTime(),
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
    expect(sorted[0].durationInMinutes).toBeLessThanOrEqual(
      sorted[1].durationInMinutes,
    );
    expect(sorted[1].durationInMinutes).toBeLessThanOrEqual(
      sorted[2].durationInMinutes,
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
    const price0 = sorted[0].fares?.[0]?.priceInCents ?? Infinity;
    const price1 = sorted[1].fares?.[0]?.priceInCents ?? Infinity;
    const price2 = sorted[2].fares?.[0]?.priceInCents ?? Infinity;
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

    wrapper.vm.sortBy = "duration";
    await wrapper.vm.$nextTick();
    await wrapper.vm.handleSort("departureAt");
    await wrapper.vm.$nextTick();

    const headerText = wrapper.find("thead").text();
    expect(headerText).toContain("Departure Time ↑");
  });

  it("shows sort indicator for descending", async () => {
    const wrapper = mount(ConnectionResultsTable, {
      props: {
        connections: mockConnections,
        isFetching: false,
        error: null,
      },
    });

    await wrapper.vm.handleSort("departureAt");
    await wrapper.vm.$nextTick();

    const headerText = wrapper.find("thead").text();
    expect(headerText).toContain("Departure Time ↓");
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
    expect(sorted[0].fares?.[0]?.priceInCents).toBeUndefined();
  });
});
