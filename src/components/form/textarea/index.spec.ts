import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";

import ETextarea from "./index.vue";

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

const mountTextarea = (props: Record<string, unknown> = {}) => {
  return mount(ETextarea, {
    attachTo: document.body,
    props: {
      modelValue: "",
      label: "Description",
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

describe("ETextarea", () => {
  it("emits focus and blur events from the textarea input", async () => {
    const wrapper = mountTextarea();
    await nextTick();

    const input = wrapper.get(".e-textarea__input");

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
});
