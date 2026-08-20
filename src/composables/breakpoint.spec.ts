import { describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick } from "vue";
import { mount } from "@vue/test-utils";

import useBreakpoint from "./breakpoint";

const mountWithWidth = (width: number) => {
  window.innerWidth = width;

  const state: { viewport?: Record<string, boolean>; resolved?: boolean } = {};

  const wrapper = mount(
    defineComponent({
      setup() {
        const { viewport, resolved } = useBreakpoint();

        return () => {
          state.viewport = { ...viewport };
          state.resolved = resolved.value;
          return h("div");
        };
      },
    }),
  );

  return { wrapper, state };
};

describe("useBreakpoint", () => {
  it("resolves the viewport on mount without waiting for the debounce", async () => {
    vi.useFakeTimers();

    const { wrapper, state } = mountWithWidth(500);
    await nextTick();

    expect(state.resolved).toBe(true);
    expect(state.viewport?.xs).toBe(true);

    vi.useRealTimers();
    wrapper.unmount();
  });

  it("keeps the breakpoints mutually exclusive across widths", async () => {
    const cases: Array<[number, string]> = [
      [500, "xs"],
      [800, "sm"],
      [1100, "md"],
      [1600, "lg"],
      [2200, "xl"],
    ];

    for (const [width, expected] of cases) {
      const { wrapper, state } = mountWithWidth(width);
      await nextTick();

      const active = Object.entries(state.viewport || {})
        .filter(([, value]) => value)
        .map(([key]) => key);

      expect(active).toEqual([expected]);

      wrapper.unmount();
    }
  });

  it("debounces resize updates", async () => {
    vi.useFakeTimers();

    const { wrapper, state } = mountWithWidth(2200);
    await nextTick();
    expect(state.viewport?.xl).toBe(true);

    window.innerWidth = 500;
    window.dispatchEvent(new Event("resize"));
    await nextTick();
    expect(state.viewport?.xl).toBe(true);

    vi.advanceTimersByTime(300);
    await nextTick();
    expect(state.viewport?.xs).toBe(true);

    vi.useRealTimers();
    wrapper.unmount();
  });
});
