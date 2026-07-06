import { afterEach, describe, expect, it, vi } from "vitest";
import { computed, defineComponent, h, inject, nextTick, provide, ref } from "vue";
import { mount } from "@vue/test-utils";

import { LIST_KEY } from "@/components/list/constants";
import ESelect from "./index.vue";

if (!HTMLElement.prototype.scrollIntoView) {
  HTMLElement.prototype.scrollIntoView = () => undefined;
}

const EMenuStub = defineComponent({
  name: "EMenu",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    activator: {
      type: [Object, String],
      default: null,
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

const EChipStub = defineComponent({
  name: "EChip",
  props: {
    clickable: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click:close"],
  setup(props, { slots, emit }) {
    return () =>
      h("div", {
        "data-testid": "chip",
        role: props.clickable ? "button" : undefined,
        tabindex: props.clickable ? 0 : undefined,
        "aria-pressed": props.clickable ? String(props.selected) : undefined,
      }, [
        slots.default?.(),
        h("button", {
          type: "button",
          "data-testid": "chip-close",
          onClick: () => emit("click:close"),
        }),
      ]);
  },
});

const EListStub = defineComponent({
  name: "EList",
  props: {
    modelValue: {
      type: [Array, String, Number],
      default: undefined,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { slots, attrs, emit }) {
    const listNode = ref<HTMLElement | null>(null);
    const focusedItemId = ref<string | null>(null);

    const getFocusableItems = (): Array<HTMLElement> => {
      if (!listNode.value) return [];

      return Array.from(listNode.value.querySelectorAll<HTMLElement>('[data-e-list-item="true"]'));
    };

    const focusItemAtIndex = (index: number): void => {
      const item = getFocusableItems()[index];

      if (!item?.id) return;

      focusedItemId.value = item.id;
      item.focus();
    };

    provide(LIST_KEY, {
      changeModelValue: (value: string | number | undefined | null) => {
        if (Array.isArray(props.modelValue)) {
          const includesValue = props.modelValue.includes(value as string | number);
          emit(
            "update:modelValue",
            includesValue
              ? props.modelValue.filter((item) => item !== value)
              : [...props.modelValue, value as string | number],
          );
          return;
        }

        emit("update:modelValue", value === props.modelValue ? undefined : value);
      },
      changeGroupValue: () => undefined,
      modelValue: computed(() => props.modelValue),
      group: computed(() => undefined),
      color: computed(() => undefined),
      size: computed(() => undefined),
      disabled: computed(() => false),
      isListbox: computed(() => true),
      focusedItemId: computed(() => focusedItemId.value),
      setFocusedItem: (value: string | null) => {
        focusedItemId.value = value;
      },
      moveFocus: (currentId: string, direction: "next" | "previous" | "first" | "last") => {
        const items = getFocusableItems();
        const currentIndex = items.findIndex((item) => item.id === currentId);

        if (items.length === 0) return;
        if (direction === "first") {
          focusItemAtIndex(0);
          return;
        }
        if (direction === "last") {
          focusItemAtIndex(items.length - 1);
          return;
        }

        const nextIndex = currentIndex < 0
          ? 0
          : direction === "next"
            ? Math.min(currentIndex + 1, items.length - 1)
            : Math.max(currentIndex - 1, 0);

        focusItemAtIndex(nextIndex);
      },
      navigateGroupedFocus: () => undefined,
      syncFocusableItem: (candidateId?: string) => {
        if (!focusedItemId.value && candidateId) {
          focusedItemId.value = candidateId;
        }
      },
    });

    return () => h("div", { ...attrs, ref: listNode }, slots.default?.());
  },
});

const EListItemStub = defineComponent({
  name: "EListItem",
  props: {
    value: {
      type: [String, Number],
      default: undefined,
    },
  },
  emits: ["click:item"],
  setup(props, { slots, attrs, emit }) {
    const parentList = inject<any>(LIST_KEY, undefined);
    const itemId = computed(() => String(attrs.id ?? ""));
    const tabIndex = computed(() => {
      const focusedId = parentList?.focusedItemId?.value;

      if (!focusedId) return 0;
      return focusedId === itemId.value ? 0 : -1;
    });

    const selectItem = (event?: MouseEvent | KeyboardEvent): void => {
      emit("click:item", event as MouseEvent);
      parentList?.setFocusedItem?.(itemId.value);
      parentList?.changeModelValue?.(props.value);
    };

    return () => h("div", {
      ...attrs,
      id: itemId.value,
      role: attrs.role ?? "option",
      tabindex: tabIndex.value,
      "data-e-list-item": "true",
      onClick: (event: MouseEvent) => selectItem(event),
      onFocus: () => parentList?.setFocusedItem?.(itemId.value),
      onKeydown: (event: KeyboardEvent) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          parentList?.moveFocus?.(itemId.value, "next");
          return;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          parentList?.moveFocus?.(itemId.value, "previous");
          return;
        }

        if (event.key === "Home") {
          event.preventDefault();
          parentList?.moveFocus?.(itemId.value, "first");
          return;
        }

        if (event.key === "End") {
          event.preventDefault();
          parentList?.moveFocus?.(itemId.value, "last");
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
        }
      },
      onKeyup: (event: KeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        selectItem(event);
      },
    }, slots.default?.());
  },
});

const EProgressLinearStub = defineComponent({
  name: "EProgressLinear",
  setup(_, { attrs }) {
    return () => h("div", { ...attrs, "data-testid": "progress-linear" });
  },
});

const mountSelect = (props: Record<string, unknown> = {}) => {
  return mount(ESelect, {
    attachTo: document.body,
    props: {
      modelValue: null,
      label: "Channel",
      detail: "Helper text",
      items: ["Email", "Slack"],
      ...props,
    },
    global: {
      stubs: {
        EMenu: EMenuStub,
        EButton: EButtonStub,
        EIcon: EIconStub,
        EDetails: EDetailsStub,
        EChip: EChipStub,
        EList: EListStub,
        EListItem: EListItemStub,
        EProgressLinear: EProgressLinearStub,
      },
    },
  });
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ESelect", () => {
  it("renders the select within EField structure with correct semantic classes", async () => {
    const wrapper = mountSelect();
    await nextTick();

    expect(wrapper.classes()).toContain("e-select");
    expect(wrapper.classes()).toContain("e-field");
    expect(wrapper.find(".e-field__frame").exists()).toBe(true);
    expect(wrapper.get(".e-select__selections").classes()).toContain("e-field__slot");
    expect(wrapper.get(".e-select__input").attributes("role")).toBe("combobox");
    expect(wrapper.find(".e-select__selections .e-select__input").exists()).toBe(true);
    expect(wrapper.find(".e-select__indicator").exists()).toBe(true);
    expect(wrapper.find(".e-select__selection").exists()).toBe(false);
    expect(wrapper.find(".e-select__menu").exists()).toBe(false);
  });

  it("renders select affordance elements", async () => {
    const wrapper = mountSelect({
      clearable: true,
      modelValue: "one",
    });
    await nextTick();

    expect(wrapper.find(".e-select__clear").exists()).toBe(true);
    expect(wrapper.find(".e-select__indicator").exists()).toBe(true);
  });

  it("wires supporting text and error state to the combobox aria attributes", async () => {
    const wrapper = mountSelect({ detailErrors: ["Required selection"] });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');
    const details = wrapper.get('[data-testid="details"]');

    expect(input.attributes("aria-describedby")).toBe(details.attributes("id"));
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(details.attributes("data-has-error")).toBe("true");
  });

  it("does not open the menu when the input only receives focus", async () => {
    const wrapper = mountSelect();
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find(".e-select__menu").exists()).toBe(false);

    await input.trigger("focus");
    await nextTick();

    expect(input.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find(".e-select__menu").exists()).toBe(false);
  });

  it("opens automatically after loading only when there was explicit interaction intent", async () => {
    const wrapper = mountSelect({ loading: true, items: [] });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await input.trigger("mousedown");
    (input.element as HTMLInputElement).focus();
    await input.trigger("focus");
    await wrapper.setProps({ items: ["Spain", "Mexico"] });
    await wrapper.setProps({ loading: false });
    await nextTick();

    expect(input.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find(".e-select__menu").exists()).toBe(true);
  });

  it("does not open automatically after loading when focus was passive", async () => {
    const wrapper = mountSelect({ loading: true, items: [] });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    (input.element as HTMLInputElement).focus();
    await input.trigger("focus");
    await wrapper.setProps({ items: ["Spain", "Mexico"] });
    await wrapper.setProps({ loading: false });
    await nextTick();

    expect(input.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find(".e-select__menu").exists()).toBe(false);
  });

  it("does not open automatically after loading if the field lost focus", async () => {
    const wrapper = mountSelect({ loading: true, items: [] });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await input.trigger("mousedown");
    (input.element as HTMLInputElement).focus();
    await input.trigger("focus");
    await input.trigger("blur");
    await wrapper.setProps({ items: ["Spain", "Mexico"] });
    await wrapper.setProps({ loading: false });
    await nextTick();

    expect(input.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find(".e-select__menu").exists()).toBe(false);
  });

  it("emits focus and blur events from the input", async () => {
    const wrapper = mountSelect();
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

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

  it("updates search and keeps the menu open in autocomplete mode", async () => {
    const wrapper = mountSelect({ autocomplete: true, multiple: true });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await input.trigger("focus");
    await input.setValue("Sl");
    await nextTick();

    expect(wrapper.emitted("update:search")).toEqual([["Sl"]]);
    expect(input.attributes("aria-expanded")).toBe("true");
  });

  it("opens the menu when pressing enter or space from the input", async () => {
    const wrapper = mountSelect();
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await input.trigger("focus");
    await input.trigger("keydown", { key: "Enter" });
    await nextTick();

    expect(input.attributes("aria-expanded")).toBe("true");
    expect(wrapper.find(".e-select__menu").exists()).toBe(true);

    await wrapper.setProps({ modelValue: null });
    await input.trigger("keydown", { key: " " });
    await nextTick();

    expect(input.attributes("aria-expanded")).toBe("true");
  });

  it("shows loading state without dropping the semantic field root", async () => {
    const wrapper = mountSelect({ loading: true });
    await nextTick();

    expect(wrapper.classes()).toContain("e-select");
    expect(wrapper.classes()).toContain("e-select--loading");
    expect(wrapper.find('[data-testid="progress-linear"]').exists()).toBe(true);
  });

  it("renders semantic adornment classes around the control", async () => {
    const wrapper = mountSelect({
      prefix: "$",
      suffix: "USD",
      prependIcon: "$check",
      appendIcon: "$check",
    });
    await nextTick();

    expect(wrapper.find(".e-select__prefix").exists()).toBe(true);
    expect(wrapper.find(".e-select__suffix").exists()).toBe(true);
    expect(wrapper.findAll(".e-field__prepend")).toHaveLength(1);
    expect(wrapper.findAll(".e-field__append")).toHaveLength(1);
  });

  it("returns focus to the input after removing a selection chip", async () => {
    const wrapper = mountSelect({
      modelValue: ["Email"],
      items: ["Email", "Slack"],
      multiple: true,
      chip: true,
    });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');
    const focusSpy = vi.spyOn(input.element as HTMLInputElement, "focus");

    await wrapper.get('[data-testid="chip-close"]').trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toEqual([[[]]]);
    expect(focusSpy).toHaveBeenCalled();
  });

  it("clears the value, resets search, emits clear and keeps focus", async () => {
    const wrapper = mountSelect({
      modelValue: ["Email"],
      items: ["Email", "Slack"],
      multiple: true,
      clearable: true,
      autocomplete: true,
      search: "Em",
    });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');
    const focusSpy = vi.spyOn(input.element as HTMLInputElement, "focus");

    await wrapper.get(".e-field__clear").trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toContainEqual([[]]);
    expect(wrapper.emitted("update:search")).toContainEqual([""]);
    expect(wrapper.emitted("click:clear")).toEqual([[]]);
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(focusSpy).toHaveBeenCalled();
  });

  it("focuses the input when pressing a selected chip body", async () => {
    const wrapper = mountSelect({
      modelValue: ["Email"],
      items: ["Email", "Slack"],
      multiple: true,
      chip: true,
      autocomplete: true,
    });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');
    const focusSpy = vi.spyOn(input.element as HTMLInputElement, "focus");

    await input.trigger("keydown", { key: "Backspace" });
    await nextTick();
    await wrapper.get('[data-testid="chip"]').trigger("mousedown");
    await nextTick();

    expect(focusSpy).toHaveBeenCalled();
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("focuses the input when clicking inside the slot", async () => {
    const wrapper = mountSelect({ autocomplete: true });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await wrapper.get(".e-select__selections").trigger("mousedown");
    await nextTick();

    expect(document.activeElement).toBe(input.element);
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(wrapper.find(".e-select__menu").exists()).toBe(false);
  });

  it("closes the menu on escape and clears autocomplete search on close", async () => {
    const wrapper = mountSelect({ autocomplete: true, search: "Em" });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await input.trigger("focus");
    await input.setValue("Em");
    await nextTick();
    await input.trigger("keydown", { key: "Escape" });
    await nextTick();

    expect(input.attributes("aria-expanded")).toBe("false");
    expect(wrapper.emitted("update:search")).toContainEqual([""]);
  });

  it("opens the menu, transfers focus to the first option and selects through the list", async () => {
    const wrapper = mountSelect({ items: ["Email", "Slack", "Teams"] });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await input.trigger("focus");
    await input.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    const listboxId = input.attributes("aria-controls");
    const firstOptionId = `${listboxId?.replace("-listbox", "")}-option-0`;

    expect(input.attributes("aria-expanded")).toBe("true");
    expect((document.activeElement as HTMLElement | null)?.id).toBe(firstOptionId);

    await wrapper.get(`#${firstOptionId}`).trigger("keydown", { key: "ArrowDown" });
    await wrapper.get(`#${listboxId?.replace("-listbox", "")}-option-1`).trigger("keyup", { key: "Enter" });
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toContainEqual(["Slack"]);
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("keeps the floating label and focus visuals while the list owns focus", async () => {
    const wrapper = mountSelect({
      items: ["Email", "Slack", "Teams"],
      labelBehavior: "floating",
    });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await input.trigger("focus");
    await input.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    expect(wrapper.classes()).toContain("e-field--is-focus-within");
    expect(wrapper.classes()).toContain("e-field--label-floated");
    expect(wrapper.get(".e-label").classes()).toContain("e-label--floated");
  });

  it("closes the menu and moves focus to the next tabbable after the field on tab", async () => {
    const beforeButton = document.createElement("button");
    beforeButton.type = "button";
    beforeButton.dataset.testid = "before";
    document.body.append(beforeButton);

    const wrapper = mountSelect({ items: ["Email", "Slack", "Teams"] });

    const afterButton = document.createElement("button");
    afterButton.type = "button";
    afterButton.dataset.testid = "after";
    document.body.append(afterButton);

    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await input.trigger("focus");
    await input.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    const option = wrapper.get('[data-e-list-item="true"]');

    await option.trigger("keydown", { key: "Tab" });
    await nextTick();

    expect(document.activeElement).toBe(afterButton);
    expect(input.attributes("aria-expanded")).toBe("false");
  });

  it("closes the menu and moves focus to the previous tabbable before the field on shift tab", async () => {
    const beforeButton = document.createElement("button");
    beforeButton.type = "button";
    beforeButton.dataset.testid = "before";
    document.body.append(beforeButton);

    const wrapper = mountSelect({ items: ["Email", "Slack", "Teams"] });

    const afterButton = document.createElement("button");
    afterButton.type = "button";
    afterButton.dataset.testid = "after";
    document.body.append(afterButton);

    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await input.trigger("focus");
    await input.trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    const option = wrapper.get('[data-e-list-item="true"]');

    await option.trigger("keydown", { key: "Tab", shiftKey: true });
    await nextTick();

    expect(document.activeElement).toBe(beforeButton);
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(document.activeElement).not.toBe(afterButton);
  });

  it("selects and removes the last chip with backspace in multiple chip mode", async () => {
    const wrapper = mountSelect({
      modelValue: ["Email", "Slack"],
      items: ["Email", "Slack", "Teams"],
      multiple: true,
      chip: true,
      autocomplete: true,
    });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');

    await input.trigger("focus");
    await nextTick();
    await input.trigger("keydown", { key: "Backspace" });
    await nextTick();

    const chipsAfterFirstBackspace = wrapper.findAll('[data-testid="chip"]');
    expect(chipsAfterFirstBackspace[1]?.attributes("aria-pressed")).toBe("true");

    await input.trigger("keydown", { key: "Backspace" });
    await nextTick();

    expect(wrapper.emitted("update:modelValue")).toContainEqual([["Email"]]);
  });

  it("does not move focus to the first chip close button when clicking the closed slot", async () => {
    const wrapper = mountSelect({
      modelValue: ["Email", "Slack"],
      items: ["Email", "Slack", "Teams"],
      multiple: true,
      chip: true,
    });
    await nextTick();

    const input = wrapper.get('input[role="combobox"]');
    const firstCloseButton = wrapper.get('[data-testid="chip-close"]');

    await wrapper.get(".e-select__selections").trigger("mousedown");
    await wrapper.get(".e-select__selections").trigger("click");
    await nextTick();

    expect(document.activeElement).toBe(input.element);
    expect(document.activeElement).not.toBe(firstCloseButton.element);
    expect(wrapper.find(".e-select__menu").exists()).toBe(false);
  });

  it("keeps selected values visible when the items list is filtered", async () => {
    const wrapper = mountSelect({
      modelValue: ["Email"],
      items: ["Slack"],
      multiple: true,
      chip: true,
      search: "Em",
    });
    await nextTick();

    expect(wrapper.find('[data-testid="chip"]').text()).toContain("Email");
  });

  it("keeps object selection labels visible when filtered items exclude them", async () => {
    const wrapper = mountSelect({
      modelValue: [1],
      items: [
        { text: "Email", value: 1 },
        { text: "Slack", value: 2 },
      ],
      multiple: true,
      chip: true,
    });
    await nextTick();

    await wrapper.setProps({
      items: [{ text: "Slack", value: 2 }],
      search: "Sl",
    });
    await nextTick();

    expect(wrapper.find('[data-testid="chip"]').text()).toContain("Email");
  });

  it("preserves falsy selected values", async () => {
    const wrapper = mountSelect({
      modelValue: 0,
      items: [0, 1],
    });
    await nextTick();

    expect(wrapper.find(".e-select__selection").text()).toContain("0");
  });
});