import { afterEach, describe, expect, it } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";

import { CalendarScale } from "@/types";
import type { ScheduleEvent, ScheduleSpace } from "@/types";

import ESchedule from "./index.vue";

const EButtonStub = defineComponent({
  name: "EButton",
  props: {
    color: {
      type: String,
      default: undefined,
    },
    text: {
      type: Boolean,
      default: false,
    },
    depressed: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(_, { attrs, emit, slots }) {
    return () =>
      h(
        "button",
        {
          ...attrs,
          type: "button",
          onClick: (event: MouseEvent) => emit("click", event),
        },
        slots.default?.(),
      );
  },
});

const EIconStub = defineComponent({
  name: "EIcon",
  setup(_, { attrs }) {
    return () => h("span", attrs);
  },
});

const EProgressLinearStub = defineComponent({
  name: "EProgressLinear",
  setup(_, { attrs }) {
    return () => h("div", attrs);
  },
});

const spaces: ScheduleSpace[] = [
  { id: "room-a", label: "Room A" },
  { id: "room-b", label: "Room B" },
];

const modelValue = new Date(2024, 0, 2, 0, 0, 0);

const mountSchedule = (
  props: Record<string, unknown> = {},
  options: any = {},
) => {
  const { global: globalOptions, ...mountOptions } = options;

  return mount(ESchedule, {
    attachTo: document.body,
    props: {
      modelValue,
      view: "calendar",
      scale: "day",
      spaces,
      start: 9 * 60 * 60,
      end: 11 * 60 * 60,
      step: 60 * 60,
      ...props,
    },
    ...mountOptions,
    global: {
      directives: {
        ripple: {},
      },
      stubs: {
        EButton: EButtonStub,
        EIcon: EIconStub,
        EProgressLinear: EProgressLinearStub,
      },
      ...globalOptions,
    },
  });
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("ESchedule", () => {
  it("exposes loading state on the schedule region without fake grid roles", async () => {
    const wrapper = mountSchedule({ loading: true });
    await nextTick();

    const region = wrapper.get('[role="region"]');

    expect(region.attributes("aria-busy")).toBe("true");
    expect(wrapper.find('[role="col"]').exists()).toBe(false);
    expect(wrapper.find('[role="cell"]').exists()).toBe(false);
  });

  it("falls back to the first space when day mode has no selectedSpace", async () => {
    const events: ScheduleEvent[] = [
      {
        id: "checkup-room-a",
        entityId: "room-a",
        name: "Checkup",
        start: new Date(2024, 0, 2, 9, 0, 0),
        end: new Date(2024, 0, 2, 10, 0, 0),
        color: "primary",
      },
    ];

    const wrapper = mountSchedule({ events });
    await nextTick();
    await nextTick();

    const eventButton = wrapper.get("button.e-schedule__event-container");

    expect(eventButton.text()).toContain("Checkup");
    expect(eventButton.attributes("aria-label")).toContain("Checkup");
  });

  it("renders default events as buttons and emits click:event", async () => {
    const event: ScheduleEvent = {
      id: "consultation-room-a",
      entityId: "room-a",
      name: "Consultation",
      subtitle: "General medicine",
      footer: "Room A",
      start: new Date(2024, 0, 2, 9, 0, 0),
      end: new Date(2024, 0, 2, 10, 0, 0),
      color: "primary",
    };

    const wrapper = mountSchedule({ events: [event] });
    await nextTick();
    await nextTick();

    const eventButton = wrapper.get("button.e-schedule__event-container");
    await eventButton.trigger("click");

    const emittedClickEvent = wrapper.emitted("click:event") as Array<[{ data: ScheduleEvent }]> | undefined;

    expect(emittedClickEvent).toHaveLength(1);
    expect(emittedClickEvent?.[0]?.[0].data).toMatchObject({
      name: "Consultation",
      entityId: "room-a",
    });
  });

  it("injects palette-backed event colors through css variables", async () => {
    const event: ScheduleEvent = {
      id: "palette-color-room-a",
      entityId: "room-a",
      name: "Palette color",
      start: new Date(2024, 0, 2, 9, 0, 0),
      end: new Date(2024, 0, 2, 10, 0, 0),
      color: "primary",
    };

    const wrapper = mountSchedule({ events: [event] });
    await nextTick();
    await nextTick();

    const eventWrapper = wrapper.get(".e-schedule__event");
    const eventButton = wrapper.get("button.e-schedule__event-container");
    const wrapperStyle = eventWrapper.attributes("style");

    expect(wrapperStyle).toContain("--schedule-local-event-bg: var(--e-color-primary);");
    expect(wrapperStyle).toContain("--schedule-local-event-color: var(--e-contrast-primary, white);");
    expect(eventButton.classes()).toContain("e-schedule__event-container");
    expect(eventButton.classes()).not.toContain("primary");
  });

  it("applies md elevation to events by default", async () => {
    const event: ScheduleEvent = {
      id: "elevation-default-room-a",
      entityId: "room-a",
      name: "Default elevation",
      start: new Date(2024, 0, 2, 9, 0, 0),
      end: new Date(2024, 0, 2, 10, 0, 0),
      color: "primary",
    };

    const wrapper = mountSchedule({ events: [event] });
    await nextTick();
    await nextTick();

    expect(wrapper.get(".e-schedule__event").classes()).toContain("e-elevation--md");
  });

  it("allows overriding event elevation", async () => {
    const event: ScheduleEvent = {
      id: "elevation-override-room-a",
      entityId: "room-a",
      name: "Override elevation",
      start: new Date(2024, 0, 2, 9, 0, 0),
      end: new Date(2024, 0, 2, 10, 0, 0),
      color: "primary",
    };

    const wrapper = mountSchedule({ events: [event], eventElevation: "xl" });
    await nextTick();
    await nextTick();

    expect(wrapper.get(".e-schedule__event").classes()).toContain("e-elevation--xl");
  });

  it("allows disabling event elevation explicitly", async () => {
    const event: ScheduleEvent = {
      id: "elevation-none-room-a",
      entityId: "room-a",
      name: "No elevation",
      start: new Date(2024, 0, 2, 9, 0, 0),
      end: new Date(2024, 0, 2, 10, 0, 0),
      color: "primary",
    };

    const wrapper = mountSchedule({ events: [event], eventElevation: "none" });
    await nextTick();
    await nextTick();

    expect(wrapper.get(".e-schedule__event").classes()).not.toContain("e-elevation--md");
    expect(wrapper.get(".e-schedule__event").classes()).not.toContain("e-elevation--none");
  });

  it("renders default empty slots as buttons and emits click:empty-slot with the resolved space", async () => {
    const wrapper = mountSchedule();
    await nextTick();
    await nextTick();

    const emptySlotButton = wrapper.get("button.e-schedule__empty-slot");
    await emptySlotButton.trigger("click");

    const emittedEmptySlot = wrapper.emitted("click:empty-slot") as Array<[{ data: ScheduleEvent }]> | undefined;

    expect(emptySlotButton.attributes("aria-label")).toContain("Create event for room-a");
    expect(emittedEmptySlot).toHaveLength(1);
    expect(emittedEmptySlot?.[0]?.[0].data).toMatchObject({
      entityId: "room-a",
      name: "",
      color: "primary",
    });
  });

  it("labels pagination controls when the resource view spans multiple pages", async () => {
    const wrapper = mountSchedule({
      view: "resource",
      resourceColumns: 1,
    });
    await nextTick();

    expect(wrapper.get('button[aria-label="Previous resource page"]').attributes("title")).toBe("Previous resource page");
    expect(wrapper.get('button[aria-label="Next resource page"]').attributes("title")).toBe("Next resource page");
  });

  it("returns to calendar with the selected resource when a resource header is clicked", async () => {
    const wrapper = mountSchedule({
      view: "resource",
      scale: "week",
      resourceColumns: 1,
    });
    await nextTick();

    await wrapper.get('button[aria-label="Select resource column Room A"]').trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:selected-space")).toEqual([[spaces[0]]]);
    expect(wrapper.emitted("update:view")).toEqual([["calendar"]]);
  });

  it("applies elevation classes like card", async () => {
    const wrapper = mountSchedule({ elevation: "lg" });
    await nextTick();

    expect(wrapper.get(".e-schedule-container").classes()).toContain("e-elevation--lg");
  });

  it("applies a normalized height to the schedule container", async () => {
    const wrapper = mountSchedule({ height: 480 });
    await nextTick();

    const container = wrapper.get(".e-schedule-container");
    const containerElement = container.element as HTMLElement;
    expect(containerElement.style.height).toBe("480px");

    await wrapper.setProps({ height: "50vh" });
    expect(containerElement.style.height).toBe("50vh");
  });

  it("allows returning to week after drilling down into a day", async () => {
    const wrapper = mountSchedule({ scale: "week", hideToolbar: true });
    await nextTick();

    const weekDayButtons = wrapper.findAll("button.e-schedule-btn--day");
    expect(weekDayButtons).toHaveLength(7);

    await weekDayButtons[2].trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:scale")).toEqual([["day"]]);
    await wrapper.setProps({ scale: CalendarScale.Day });
    await nextTick();

    expect(wrapper.find('button[aria-label="Back to week view"]').exists()).toBe(true);
    expect(wrapper.findAll("button.e-schedule-btn--day")).toHaveLength(0);

    await wrapper.get('button[aria-label="Back to week view"]').trigger("click");
    await nextTick();

    expect(wrapper.emitted("update:scale")).toEqual([["day"], ["week"]]);
    await wrapper.setProps({ scale: CalendarScale.Week });
    await nextTick();

    expect(wrapper.find('button[aria-label="Back to week view"]').exists()).toBe(false);
    expect(wrapper.findAll("button.e-schedule-btn--day")).toHaveLength(7);
  });

  it("exposes toolbar slot actions and hides duplicate header actions", async () => {
    const wrapper = mountSchedule(
      { scale: "week" },
      {
        slots: {
          toolbar: ({ canReturnToWeek, goToNextPeriod, returnToWeekView }: { canReturnToWeek: boolean; goToNextPeriod: () => void; returnToWeekView: () => void }) =>
            h("div", [
              h("span", { "data-return-to-week": String(canReturnToWeek) }),
              h(
                "button",
                {
                  type: "button",
                  class: "toolbar-next-period",
                  onClick: () => goToNextPeriod(),
                },
                "Next period",
              ),
              h(
                "button",
                {
                  type: "button",
                  class: "toolbar-return-to-week",
                  onClick: () => returnToWeekView(),
                },
                "Return to week",
              ),
            ]),
        },
      },
    );
    await nextTick();

    await wrapper.get(".toolbar-next-period").trigger("click");

    const emittedModelValue = wrapper.emitted("update:modelValue") as Array<[Date]> | undefined;
    expect(emittedModelValue).toHaveLength(1);
    expect(emittedModelValue?.[0]?.[0].getDate()).toBe(9);

    const weekDayButtons = wrapper.findAll("button.e-schedule-btn--day");
    await weekDayButtons[1].trigger("click");
    await nextTick();
    await wrapper.setProps({ scale: CalendarScale.Day });
    await nextTick();

    expect(wrapper.find('button[aria-label="Back to week view"]').exists()).toBe(false);
    expect(wrapper.find('[data-return-to-week="true"]').exists()).toBe(true);

    await wrapper.get(".toolbar-return-to-week").trigger("click");

    expect(wrapper.emitted("update:scale")).toEqual([["day"], ["week"]]);
  });

  it("passes localized toolbar labels through slot props", async () => {
    const wrapper = mountSchedule(
      { lng: "es" },
      {
        slots: {
          toolbar: ({ labels }: { labels: { today: string; view: string } }) =>
            h("div", { class: "toolbar-i18n" }, `${labels.view} · ${labels.today}`),
        },
      },
    );
    await nextTick();

    expect(wrapper.get(".toolbar-i18n").text()).toBe("Vista · Hoy");
  });
});