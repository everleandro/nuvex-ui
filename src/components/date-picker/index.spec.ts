import { describe, expect, it } from "vitest";
import { defineComponent, h } from "vue";
import { mount } from "@vue/test-utils";

import EDatePicker from "./index.vue";

const TransitionStub = defineComponent({
  name: "Transition",
  props: {
    name: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "div",
        {
          class: "transition-stub",
          "data-name": props.name,
          "data-mode": props.mode,
        },
        slots.default?.(),
      );
  },
});

const EButtonStub = defineComponent({
  name: "EButton",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(props, { attrs, emit, slots }) {
    return () =>
      h(
        "button",
        {
          ...attrs,
          class: attrs.class,
          disabled: props.disabled,
          type: "button",
          onClick: (event: MouseEvent) => emit("click", event),
        },
        slots.default?.(),
      );
  },
});

const mountDatePicker = (props: Record<string, unknown> = {}) => {
  return mount(EDatePicker, {
    props: {
      modelValue: new Date(2026, 2, 14),
      ...props,
    },
    global: {
      stubs: {
        EButton: EButtonStub,
        transition: TransitionStub,
      },
    },
  });
};

const getDayButton = (wrapper: ReturnType<typeof mountDatePicker>, day: number) => {
  return wrapper
    .findAll(".date-view .grid-body button")
    .find((button) => button.text() === String(day) && !button.classes().includes("e-picker-day--adjacent-month"));
};

const getSelectedDayButton = (wrapper: ReturnType<typeof mountDatePicker>) => {
  return wrapper
    .findAll(".date-view .grid-body button")
    .find((button) => button.classes().includes("e-picker-day--selected"));
};

const getTransitionNames = (wrapper: ReturnType<typeof mountDatePicker>) => {
  return wrapper
    .findAll(".transition-stub")
    .map((transition) => transition.attributes("data-name"));
};

describe("EDatePicker", () => {
  it("renders the initial month from modelValue on first paint", () => {
    const wrapper = mountDatePicker({ modelValue: new Date(2026, 4, 10) });
    const headerText = wrapper.find(".e-date-picker-header__value button").text().toLowerCase();

    expect(headerText).toContain("2026");
    expect(headerText).toContain("may");
    expect(getSelectedDayButton(wrapper)?.text()).toBe("10");
  });

  it("applies elevation to the picker container", () => {
    const wrapper = mountDatePicker({ elevation: "lg" });

    expect(wrapper.find(".e-picker").classes()).toContain("e-elevation--lg");
  });

  it("does not apply container elevation to the selected day button", () => {
    const wrapper = mountDatePicker({ elevation: "lg" });
    const selectedDay = getSelectedDayButton(wrapper);

    expect(selectedDay?.classes()).toContain("e-picker-day--selected");
    expect(selectedDay?.classes()).not.toContain("e-elevation--lg");
  });

  it("applies grid button elevation to the selected day button", () => {
    const wrapper = mountDatePicker({ gridButtonElevation: "lg" });
    const selectedDay = getSelectedDayButton(wrapper);

    expect(selectedDay?.classes()).toContain("e-picker-day--selected");
    expect(selectedDay?.classes()).toContain("e-elevation--lg");
  });

  it("disables transitions when modelValue changes externally", async () => {
    const wrapper = mountDatePicker();

    await wrapper.get('[aria-label="Next month"]').trigger("click");
    expect(getTransitionNames(wrapper)).toEqual([
      "picker-transition",
      "tab-transition",
      "tab-transition",
    ]);

    await wrapper.setProps({ modelValue: new Date(2026, 4, 10) });

    expect(getTransitionNames(wrapper)).toEqual(["", "", ""]);
  });

  it("restores transitions for internal navigation after an external modelValue sync", async () => {
    const wrapper = mountDatePicker();

    await wrapper.setProps({ modelValue: new Date(2026, 4, 10) });
    expect(getTransitionNames(wrapper)).toEqual(["", "", ""]);

    await wrapper.get('[aria-label="Next month"]').trigger("click");

    expect(getTransitionNames(wrapper)).toEqual([
      "picker-transition",
      "tab-transition",
      "tab-transition",
    ]);
  });

  it("uses fade transitions when changing between picker views", async () => {
    const wrapper = mountDatePicker({ view: 2 });

    await wrapper.get('.e-date-picker-header__value button[aria-label="2016 - 2028"]').trigger("click");

    expect(getTransitionNames(wrapper)).toEqual([
      "picker-transition",
      "picker-fade-transition",
      "picker-fade-transition",
    ]);
  });
});