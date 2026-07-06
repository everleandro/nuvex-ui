import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";

import ETimePicker from "./index.vue";

const EMenuStub = defineComponent({
  name: "EMenu",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () =>
      h("div", { "data-testid": "menu" }, [
        props.modelValue ? slots.default?.() : null,
      ]);
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
  },
  setup(props) {
    return () =>
      h("div", {
        "data-testid": "details",
        id: props.id,
        "data-details": String(props.details ?? ""),
        "data-has-error": String(props.hasError),
        "data-show-details": String(props.showDetails),
      });
  },
});

const mountTimePicker = (props: Record<string, unknown> = {}) => {
  return mount(ETimePicker, {
    attachTo: document.body,
    props: {
      modelValue: "2026-01-01T10:30:00.000Z",
      label: "Time",
      detail: "Helper text",
      ...props,
    },
    global: {
      stubs: {
        EMenu: EMenuStub,
        EButton: EButtonStub,
        EIcon: EIconStub,
        EDetails: EDetailsStub,
      },
    },
  });
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ETimePicker", () => {
  it("emits focus and blur events from its inputs", async () => {
    const wrapper = mountTimePicker();
    await nextTick();

    const hoursInput = wrapper.get("input[data-hours]");

    await hoursInput.trigger("focus");
    await hoursInput.trigger("blur");

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
