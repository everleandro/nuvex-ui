import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";

import ETextField from "./index.vue";

const EDetailsStub = defineComponent({
  name: "EDetails",
  props: {
    id: {
      type: String,
      default: undefined,
    },
    details: {
      type: [String, Boolean],
      default: undefined,
    },
    hasError: {
      type: Boolean,
      default: false,
    },
    showDetails: {
      type: Boolean,
      default: false,
    },
    counter: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: [String, Number],
      default: undefined,
    },
    modelValue: {
      type: [String, Number, null],
      default: undefined,
    },
  },
  setup(props) {
    return () =>
      h("div", {
        "data-testid": "details",
        id: props.id,
        "data-details": String(props.details ?? ""),
        "data-has-error": String(props.hasError),
      });
  },
});

const EButtonStub = defineComponent({
  name: "EButton",
  setup(_, { slots, attrs }) {
    return () => h("button", { ...attrs, type: "button" }, slots.default?.());
  },
});

const EIconStub = defineComponent({
  name: "EIcon",
  setup() {
    return () => h("span", { "data-testid": "icon" });
  },
});

const mountTextField = (props: Record<string, unknown> = {}) => {
  return mount(ETextField, {
    attachTo: document.body,
    props: {
      modelValue: "",
      label: "Name",
      detail: "Helper text",
      ...props,
    },
    global: {
      stubs: {
        EDetails: EDetailsStub,
        EButton: EButtonStub,
        EIcon: EIconStub,
      },
    },
  });
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ETextField", () => {
  it("emits semantic text field anatomy from Vue", async () => {
    const wrapper = mountTextField();
    await nextTick();

    expect(wrapper.classes()).toContain("e-text-field");
    expect(wrapper.find(".e-field__frame").exists()).toBe(true);
    expect(wrapper.get(".e-text-field__input").classes()).toContain("e-field__slot");
    expect(wrapper.get(".e-text-field__input").element.tagName).toBe("INPUT");
  });

  it("wires supporting text to the input aria attributes", async () => {
    const wrapper = mountTextField();
    await nextTick();

    const input = wrapper.get(".e-text-field__input");
    const details = wrapper.get('[data-testid="details"]');

    expect(input.attributes("aria-describedby")).toBe(details.attributes("id"));
  });

  it("emits focus and blur events from the input", async () => {
    const wrapper = mountTextField();
    await nextTick();

    const input = wrapper.get(".e-text-field__input");

    await input.trigger("focus");
    await input.trigger("blur");

    const focusEvents = wrapper.emitted("focus");
    const blurEvents = wrapper.emitted("blur");

    expect(focusEvents).toBeTruthy();
    expect(blurEvents).toBeTruthy();
    expect(focusEvents).toHaveLength(1);
    expect(blurEvents).toHaveLength(1);
    expect(focusEvents?.[0]?.[0]).toBeInstanceOf(FocusEvent);
    expect(blurEvents?.[0]?.[0]).toBeInstanceOf(FocusEvent);
  });

  it("emits model updates through native input events", async () => {
    const wrapper = mountTextField();
    await nextTick();

    await wrapper.get(".e-text-field__input").setValue("Alice");

    expect(wrapper.emitted("update:modelValue")).toEqual([["Alice"]]);
  });

  it("emits clear interactions through the semantic clear affordance", async () => {
    const wrapper = mountTextField({ modelValue: "Alice", clearable: true });
    await nextTick();

    const clear = wrapper.get(".e-field__clear");
    await clear.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toEqual([[""]]);
    expect(wrapper.emitted("click:clear")).toEqual([[]]);
  });

  it("renders semantic adornment classes around the input", async () => {
    const wrapper = mountTextField({
      modelValue: "Alice",
      prefix: "$",
      suffix: "USD",
      prependIcon: "$check",
      appendIcon: "$check",
    });
    await nextTick();

    wrapper.get(".e-text-field__input");
    expect(wrapper.find(".e-text-field__prefix").exists()).toBe(true);
    expect(wrapper.find(".e-text-field__suffix").exists()).toBe(true);
    expect(wrapper.findAll(".e-field__prepend")).toHaveLength(1);
    expect(wrapper.findAll(".e-field__append")).toHaveLength(1);
  });
});