import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import { ref } from "vue";
import AutocompleteField from "./AutocompleteField.vue";
import { useAutocompleteApi } from "../composables/useAutocompleteApi";

vi.mock("../composables/useAutocompleteApi", () => ({
  useAutocompleteApi: vi.fn(),
}));

describe("AutocompleteField", () => {
  let mockFetchStations;
  let mockResults;
  let mockIsLoading;
  let mockError;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    mockFetchStations = vi.fn();
    mockResults = ref([]);
    mockIsLoading = ref(false);
    mockError = ref(null);

    useAutocompleteApi.mockReturnValue({
      isFetching: mockIsLoading,
      error: mockError,
      results: mockResults,
      fetchStations: mockFetchStations,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders with label", () => {
    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
      },
    });

    expect(wrapper.text()).toContain("From");
  });

  it("displays placeholder", () => {
    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
        placeholder: "Enter station",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe("Enter station");
  });

  it("updates modelValue on input", async () => {
    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("Vienna");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["Vienna"]);
  });

  it("calls fetchStations on input", async () => {
    vi.useFakeTimers();
    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
        modelValue: "",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("Vienna");

    expect(mockFetchStations).not.toHaveBeenCalled();

    await vi.advanceTimersByTime(300);

    expect(mockFetchStations).toHaveBeenCalledWith("Vienna");
    vi.useRealTimers();
  });

  it("closes panel when input is empty", async () => {
    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
        modelValue: "Vienna",
      },
    });

    wrapper.vm.isOpen = true;

    const input = wrapper.find("input");
    await input.setValue("");

    expect(wrapper.vm.isOpen).toBe(false);
    expect(mockFetchStations).not.toHaveBeenCalled();
  });

  it("displays loading state", async () => {
    mockIsLoading.value = true;

    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
        modelValue: "Vienna",
      },
    });

    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Searching…");
  });

  it("displays error state", async () => {
    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
        modelValue: "Vienna",
      },
    });

    mockError.value = "Failed to fetch";
    mockIsLoading.value = false;
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Failed to fetch");
  });

  it("displays results", async () => {
    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
        modelValue: "V",
      },
    });

    mockResults.value = [
      { name: "Vienna", translatedName: "Vienna" },
      { name: "Berlin", translatedName: "Berlin" },
    ];
    mockIsLoading.value = false;
    mockError.value = null;
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Vienna");
    expect(wrapper.text()).toContain("Berlin");
  });

  it("selects option and emits update", async () => {
    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
        modelValue: "",
      },
    });

    mockResults.value = [{ name: "Vienna", translatedName: "Vienna" }];
    mockIsLoading.value = false;
    mockError.value = null;
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    const option = wrapper.find(".option");
    expect(option.exists()).toBe(true);
    await option.trigger("mousedown");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["Vienna"]);
    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("closes panel on escape key", async () => {
    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
        modelValue: "Vienna",
      },
    });

    wrapper.vm.isOpen = true;
    const input = wrapper.find("input");
    await input.trigger("keydown.escape");

    expect(wrapper.vm.isOpen).toBe(false);
  });

  it("syncs with modelValue prop changes", async () => {
    const wrapper = mount(AutocompleteField, {
      props: {
        label: "From",
        modelValue: "",
      },
    });

    await wrapper.setProps({ modelValue: "Berlin" });

    expect(wrapper.vm.query).toBe("Berlin");
  });
});
