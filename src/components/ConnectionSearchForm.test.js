import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ConnectionSearchForm from "./ConnectionSearchForm.vue";

describe("ConnectionSearchForm", () => {
  const defaultFormData = {
    from: "",
    to: "",
    departureAt: "2025-12-08T08:00",
    onlyDirect: false,
  };

  it("renders all form fields", () => {
    const wrapper = mount(ConnectionSearchForm, {
      props: {
        modelValue: defaultFormData,
      },
    });

    expect(wrapper.text()).toContain("From");
    expect(wrapper.text()).toContain("To");
    expect(wrapper.text()).toContain("Departure");
    expect(wrapper.text()).toContain("Show only direct connections");
  });

  it("emits search event on form submit", async () => {
    const wrapper = mount(ConnectionSearchForm, {
      props: {
        modelValue: defaultFormData,
      },
    });

    const form = wrapper.find("form");
    await form.trigger("submit.prevent");

    expect(wrapper.emitted("search")).toBeTruthy();
    expect(wrapper.emitted("search")).toHaveLength(1);
  });

  it("updates from field", async () => {
    const wrapper = mount(ConnectionSearchForm, {
      props: {
        modelValue: defaultFormData,
      },
    });

    const fromField = wrapper.findAllComponents({
      name: "AutocompleteField",
    })[0];
    await fromField.vm.$emit("update:modelValue", "Vienna");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    const emitted = wrapper.emitted("update:modelValue")[0][0];
    expect(emitted.from).toBe("Vienna");
    expect(emitted.to).toBe("");
  });

  it("updates to field", async () => {
    const wrapper = mount(ConnectionSearchForm, {
      props: {
        modelValue: defaultFormData,
      },
    });

    const toField = wrapper.findAllComponents({ name: "AutocompleteField" })[1];
    await toField.vm.$emit("update:modelValue", "Berlin");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    const emitted = wrapper.emitted("update:modelValue")[0][0];
    expect(emitted.to).toBe("Berlin");
    expect(emitted.from).toBe("");
  });

  it("updates departureAt field", async () => {
    const wrapper = mount(ConnectionSearchForm, {
      props: {
        modelValue: defaultFormData,
      },
    });

    const departureInput = wrapper.find('input[type="datetime-local"]');
    await departureInput.setValue("2025-12-09T10:00");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    const emitted = wrapper.emitted("update:modelValue")[0][0];
    expect(emitted.departureAt).toBe("2025-12-09T10:00");
  });

  it("updates onlyDirect checkbox", async () => {
    const wrapper = mount(ConnectionSearchForm, {
      props: {
        modelValue: defaultFormData,
      },
    });

    const checkbox = wrapper.find('input[type="checkbox"]');
    await checkbox.setValue(true);

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    const emitted = wrapper.emitted("update:modelValue")[0][0];
    expect(emitted.onlyDirect).toBe(true);
  });

  it("preserves other fields when updating one field", async () => {
    const formData = {
      from: "Vienna",
      to: "Berlin",
      departureAt: "2025-12-08T08:00",
      onlyDirect: true,
    };

    const wrapper = mount(ConnectionSearchForm, {
      props: {
        modelValue: formData,
      },
    });

    const departureInput = wrapper.find('input[type="datetime-local"]');
    await departureInput.setValue("2025-12-09T10:00");

    const emitted = wrapper.emitted("update:modelValue")[0][0];
    expect(emitted.from).toBe("Vienna");
    expect(emitted.to).toBe("Berlin");
    expect(emitted.onlyDirect).toBe(true);
    expect(emitted.departureAt).toBe("2025-12-09T10:00");
  });
});
