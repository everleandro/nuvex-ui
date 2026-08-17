import { describe, expect, it } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import { mount } from "@vue/test-utils";

import ETab from "./index.vue";
import ETabGroup from "./group.vue";
import EWindow from "../window/index.vue";
import EWindowItem from "../window/item.vue";
import EButton from "../button/index.vue";

const mountTabHost = (props: Record<string, unknown> = {}, initialValue = "overview") => {
  const Host = defineComponent({
    components: {
      ETab,
      ETabGroup,
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
      <ETabGroup v-model="model" name="settings-tabs" v-bind="$attrs">
        <ETab value="overview" :to="''">Overview</ETab>
        <ETab value="activity" :to="''">Activity</ETab>
        <ETab value="settings" :to="''">Settings</ETab>
      </ETabGroup>
      <EWindow v-model="model" name="settings-tabs">
        <EWindowItem value="overview">Overview panel</EWindowItem>
        <EWindowItem value="activity">Activity panel</EWindowItem>
        <EWindowItem value="settings">Settings panel</EWindowItem>
      </EWindow>
    `,
  });

  return mount(Host, {
    attachTo: document.body,
    attrs: props,
  });
};

describe("ETab + ETabGroup", () => {
  it("wires tab and tabpanel semantics when a group name is provided", async () => {
    const wrapper = mountTabHost();
    await nextTick();

    const tablist = wrapper.get('[role="tablist"]');
    const tabs = wrapper.findAll('[role="tab"]');
    const panels = wrapper.findAll('[role="tabpanel"]');

    expect(tablist.attributes("aria-orientation")).toBe("horizontal");
    expect(tabs).toHaveLength(3);
    expect(panels).toHaveLength(3);

    expect(tabs[0].attributes("id")).toBe("settings-tabs-tab-overview");
    expect(tabs[0].attributes("aria-controls")).toBe("settings-tabs-panel-overview");
    expect(panels[0].attributes("id")).toBe("settings-tabs-panel-overview");
    expect(panels[0].attributes("aria-labelledby")).toBe("settings-tabs-tab-overview");
  });

  it("uses roving tabindex and updates the model with keyboard navigation", async () => {
    const wrapper = mountTabHost();
    await nextTick();

    let tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0].attributes("tabindex")).toBe("0");
    expect(tabs[1].attributes("tabindex")).toBe("-1");

    await tabs[0].trigger("keydown", { key: "ArrowRight" });
    await nextTick();

    expect((wrapper.vm as { model: string }).model).toBe("activity");

    tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0].attributes("aria-selected")).toBe("false");
    expect(tabs[1].attributes("aria-selected")).toBe("true");
    expect(tabs[1].attributes("tabindex")).toBe("0");

    await tabs[1].trigger("keydown", { key: "End" });
    await nextTick();
    expect((wrapper.vm as { model: string }).model).toBe("settings");

    tabs = wrapper.findAll('[role="tab"]');
    await tabs[2].trigger("keydown", { key: "Home" });
    await nextTick();
    expect((wrapper.vm as { model: string }).model).toBe("overview");
  });

  it("switches keyboard axis in vertical mode", async () => {
    const wrapper = mountTabHost({ vertical: true }, "activity");
    await nextTick();

    const tablist = wrapper.get('[role="tablist"]');
    let tabs = wrapper.findAll('[role="tab"]');

    expect(tablist.attributes("aria-orientation")).toBe("vertical");
    expect(tabs[1].attributes("aria-selected")).toBe("true");

    await tabs[1].trigger("keydown", { key: "ArrowDown" });
    await nextTick();

    expect((wrapper.vm as { model: string }).model).toBe("settings");

    tabs = wrapper.findAll('[role="tab"]');
    await tabs[2].trigger("keydown", { key: "ArrowUp" });
    await nextTick();

    expect((wrapper.vm as { model: string }).model).toBe("activity");
  });

  it("renders an optional track line that follows group orientation", async () => {
    const wrapper = mountTabHost();
    await nextTick();
    expect(wrapper.find('.e-tabs__track').exists()).toBe(false);

    const horizontalWithTrack = mountTabHost({ track: true });
    await nextTick();
    const horizontalTrack = horizontalWithTrack.get('.e-tabs__track');
    expect(horizontalTrack.classes()).not.toContain('e-tabs__track--vertical');

    const verticalWithTrack = mountTabHost({ track: true, vertical: true });
    await nextTick();
    expect(verticalWithTrack.get('.e-tabs__track').classes()).toContain('e-tabs__track--vertical');
  });

  it("forwards anchor attributes such as href to the underlying button", async () => {
    const Host = defineComponent({
      components: { ETab, ETabGroup },
      setup() {
        const model = ref("home");
        return { model };
      },
      template: `
        <ETabGroup v-model="model">
          <ETab value="home" href="#home" :to="'#home'">Home</ETab>
        </ETabGroup>
      `,
    });

    const wrapper = mount(Host, { attachTo: document.body });
    await nextTick();

    const tab = wrapper.get('[role="tab"]');
    expect(tab.attributes('href')).toBe('#home');
  });

  it("keeps ripple enabled for tabs by default", async () => {
    const wrapper = mountTabHost();
    await nextTick();

    const firstTab = wrapper.findAll('[role="tab"]')[0];
    expect(firstTab.classes()).toContain("v-ripple-element");

    const firstTabButton = wrapper.findAllComponents(EButton)[0];
    expect(firstTabButton.props("ripple")).toBe(true);
  });
});
