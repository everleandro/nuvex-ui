import { describe, expect, it } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";

import EWindow from "./index.vue";
import EWindowItem from "./item.vue";

const mountWindowHost = (initialValue = "one") => {
  const Host = defineComponent({
    components: {
      EWindow,
      EWindowItem,
    },
    setup() {
      const model = ref<string>(initialValue);

      return {
        model,
      };
    },
    template: `
      <EWindow v-model="model" name="demo-window">
        <EWindowItem value="one">First panel</EWindowItem>
        <EWindowItem value="two">Second panel</EWindowItem>
      </EWindow>
    `,
  });

  return mount(Host, {
    attachTo: document.body,
  });
};

describe("EWindow", () => {
  it("renders track and keeps both legacy and BEM item classes", async () => {
    const wrapper = mountWindowHost();
    await nextTick();

    expect(wrapper.find(".e-window__track").exists()).toBe(true);

    const items = wrapper.findAll('[role="tabpanel"]');
    expect(items[0].classes()).toContain("e-window__item");
    expect(items[0].classes()).toContain("e-window-item");
  });

  it("updates active panel state and accessibility attributes when model changes", async () => {
    const wrapper = mountWindowHost();
    await nextTick();

    let panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels[0].attributes("aria-hidden")).toBe("false");
    expect(panels[0].attributes("tabindex")).toBe("0");
    expect(panels[1].attributes("aria-hidden")).toBe("true");
    expect(panels[1].attributes("tabindex")).toBe("-1");

    (wrapper.vm as { model: string }).model = "two";
    await nextTick();

    panels = wrapper.findAll('[role="tabpanel"]');
    expect(panels[0].attributes("aria-hidden")).toBe("true");
    expect(panels[0].classes()).not.toContain("e-window__item--active");
    expect(panels[1].attributes("aria-hidden")).toBe("false");
    expect(panels[1].classes()).toContain("e-window__item--active");
    expect(panels[1].attributes("id")).toBe("demo-window-panel-two");
    expect(panels[1].attributes("aria-labelledby")).toBe("demo-window-tab-two");
  });
});
