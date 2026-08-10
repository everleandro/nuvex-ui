import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, ref } from "vue";

import EList from "./index.vue";
import EListItem from "./item.vue";

const RouterLink = defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h("a", { ...attrs, href: "#profile" }, slots.default?.());
  },
});

const mountList = (
  template: string,
  options?: { initialValue: string | undefined },
) => mount(defineComponent({
  components: { EList, EListItem },
  setup() {
    return {
      selected: ref<string | undefined>(options ? options.initialValue : "initial"),
    };
  },
  template,
}), {
  global: { components: { RouterLink } },
});

describe("EListItem interaction", () => {
  it("is interactive by default inside a list", async () => {
    const wrapper = mountList(`
      <EList>
        <EListItem title="Profile" />
      </EList>
    `);
    const item = wrapper.get(".e-list-item");

    expect(item.classes()).toContain("e-list-item--clickeable");
    expect(item.classes()).toContain("v-ripple-element");
    expect(item.classes()).toContain("interactive-element");
    expect(item.attributes("data-e-list-item")).toBe("true");
    expect(item.attributes("tabindex")).toBe("0");
    expect(item.attributes("role")).toBe("button");

    await item.trigger("click");
    expect(wrapper.getComponent(EListItem).emitted("click:item")).toHaveLength(1);
  });

  it("is informational by default outside a list", () => {
    const wrapper = mount(EListItem, {
      props: { title: "Profile" },
    });

    expect(wrapper.classes()).not.toContain("e-list-item--clickeable");
    expect(wrapper.classes()).not.toContain("v-ripple-element");
    expect(wrapper.classes()).not.toContain("interactive-element");
    expect(wrapper.attributes("role")).toBeUndefined();
  });

  it("handles clicks when a RouterLink component is the item root", async () => {
    const wrapper = mountList(`
      <EList>
        <EListItem title="Profile" to="/profile" />
      </EList>
    `);
    const item = wrapper.get("a.e-list-item");

    await expect(item.trigger("click")).resolves.toBeUndefined();
    expect(wrapper.getComponent(EListItem).emitted("click:item")).toHaveLength(1);
  });

  it("becomes selectable automatically in a listbox", async () => {
    const wrapper = mountList(`
      <EList v-model="selected">
        <EListItem value="profile" title="Profile" />
      </EList>
    `);
    const item = wrapper.get(".e-list-item");

    expect(item.classes()).toContain("e-list-item--clickeable");
    expect(item.attributes("data-e-list-item")).toBe("true");
    expect(item.attributes("role")).toBe("option");
    expect(item.attributes("tabindex")).toBe("0");

    await item.trigger("click");
    expect((wrapper.vm as unknown as { selected?: string }).selected).toBe("profile");
    expect(wrapper.getComponent(EListItem).emitted("click:item")).toHaveLength(1);
  });

  it("keeps an empty single-selection model selectable", async () => {
    const wrapper = mountList(`
      <EList v-model="selected">
        <EListItem value="inbox" title="Inbox" />
        <EListItem value="drafts" title="Drafts" />
      </EList>
    `, { initialValue: undefined });
    const list = wrapper.get(".e-list");
    const items = wrapper.findAll(".e-list-item");

    expect(list.attributes("role")).toBe("listbox");
    expect(items[0].attributes("role")).toBe("option");

    await items[0].trigger("click");
    expect((wrapper.vm as unknown as { selected?: string }).selected).toBe("inbox");

    await items[0].trigger("click");
    expect((wrapper.vm as unknown as { selected?: string }).selected).toBeUndefined();
    expect(list.attributes("role")).toBe("listbox");
    expect(items[1].classes()).toContain("e-list-item--clickeable");
    expect(items[1].attributes("role")).toBe("option");

    await items[1].trigger("click");
    expect((wrapper.vm as unknown as { selected?: string }).selected).toBe("drafts");
  });

  it("supports explicit clickable overrides", async () => {
    const clickableWrapper = mountList(`
      <EList>
        <EListItem clickable title="Profile" />
      </EList>
    `);
    const clickableItem = clickableWrapper.get(".e-list-item");

    expect(clickableItem.attributes("role")).toBe("button");
    await clickableItem.trigger("click");
    expect(clickableWrapper.getComponent(EListItem).emitted("click:item")).toHaveLength(1);

    const staticWrapper = mountList(`
      <EList v-model="selected">
        <EListItem :clickable="false" value="profile" title="Profile" />
      </EList>
    `);
    const staticItem = staticWrapper.get(".e-list-item");

    expect(staticItem.classes()).not.toContain("e-list-item--clickeable");
    expect(staticItem.attributes("role")).toBeUndefined();
    await staticItem.trigger("click");
    expect((staticWrapper.vm as unknown as { selected?: string }).selected).toBe("initial");
  });

  it("preserves disabled option semantics without enabling interaction", async () => {
    const wrapper = mountList(`
      <EList v-model="selected">
        <EListItem disabled value="profile" title="Profile" />
      </EList>
    `);
    const item = wrapper.get(".e-list-item");

    expect(item.attributes("role")).toBe("option");
    expect(item.attributes("aria-disabled")).toBe("true");
    expect(item.attributes("tabindex")).toBe("-1");
    expect(item.classes()).not.toContain("e-list-item--clickeable");

    await item.trigger("click");
    expect((wrapper.vm as unknown as { selected?: string }).selected).toBe("initial");
  });

  it("respects ripple=false on an interactive item", async () => {
    const wrapper = mountList(`
      <EList>
        <EListItem clickable :ripple="false" title="Profile" />
      </EList>
    `);
    const item = wrapper.get(".e-list-item");

    await item.trigger("pointerdown");
    expect(item.find(".v-ripple").exists()).toBe(false);
  });

  it("keeps nested controls independent from row selection and ripple", async () => {
    const wrapper = mountList(`
      <EList v-model="selected">
        <EListItem value="profile" title="Profile">
          <template #append>
            <button type="button" data-testid="actions">Actions</button>
          </template>
        </EListItem>
      </EList>
    `);
    const item = wrapper.get(".e-list-item");
    const action = wrapper.get('[data-testid="actions"]');

    await action.trigger("pointerdown");
    await action.trigger("click");

    expect(item.find(".v-ripple").exists()).toBe(false);
    expect((wrapper.vm as unknown as { selected?: string }).selected).toBe("initial");
    expect(wrapper.getComponent(EListItem).emitted("click:item")).toBeUndefined();
  });
});
