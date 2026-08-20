import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { h } from "vue";

import EDataList from "./index.vue";
import EDataRow from "./row.vue";
import EDataCell from "./cell.vue";

describe("EDataList", () => {
  it("generates equal columns from a number", () => {
    const wrapper = mount(EDataList, { props: { columns: 4 } });

    expect(wrapper.attributes("style")).toContain(
      "--e-data-list-columns: repeat(4, minmax(0, 1fr))",
    );
  });

  it("joins an explicit track list", () => {
    const wrapper = mount(EDataList, {
      props: { columns: ["minmax(220px, 2fr)", "1fr", "140px"] },
    });

    expect(wrapper.attributes("style")).toContain(
      "--e-data-list-columns: minmax(220px, 2fr) 1fr 140px",
    );
  });

  it("does not define the column custom property without columns", () => {
    const wrapper = mount(EDataList);

    expect(wrapper.attributes("style")).toBeUndefined();
    expect(wrapper.attributes("role")).toBe("list");
  });
});

describe("EDataRow", () => {
  it("uses listitem semantics by default and does not emit clicks", async () => {
    const wrapper = mount(EDataRow);

    expect(wrapper.attributes("role")).toBe("listitem");
    expect(wrapper.attributes("tabindex")).toBeUndefined();

    await wrapper.trigger("click");

    expect(wrapper.emitted("click:row")).toBeUndefined();
  });

  it("exposes button semantics and emits on click when clickable", async () => {
    const wrapper = mount(EDataRow, { props: { clickable: true } });

    expect(wrapper.attributes("role")).toBe("button");
    expect(wrapper.attributes("tabindex")).toBe("0");

    await wrapper.trigger("click");
    await wrapper.trigger("keydown", { key: "Enter" });

    expect(wrapper.emitted("click:row")).toHaveLength(2);
  });

  it("reflects the selected state through aria-pressed", () => {
    const wrapper = mount(EDataRow, {
      props: { clickable: true, selected: true },
    });

    expect(wrapper.attributes("aria-pressed")).toBe("true");
    expect(wrapper.classes()).toContain("e-data-row--selected");
  });

  it("does not emit when disabled", async () => {
    const wrapper = mount(EDataRow, {
      props: { clickable: true, disabled: true },
    });

    await wrapper.trigger("click");

    expect(wrapper.emitted("click:row")).toBeUndefined();
    expect(wrapper.attributes("tabindex")).toBe("-1");
  });

  it("ignores clicks coming from interactive content inside a cell", async () => {
    const wrapper = mount(EDataRow, {
      props: { clickable: true },
      slots: {
        default: '<button type="button">Open</button>',
      },
      attachTo: document.body,
    });

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted("click:row")).toBeUndefined();

    wrapper.unmount();
  });
});

describe("EDataCell", () => {
  it("aligns content through a modifier class", () => {
    const wrapper = mount(EDataCell, { props: { align: "end" } });

    expect(wrapper.classes()).toContain("e-data-cell--align-end");
  });
});

describe("EDataList row inheritance", () => {
  const mountList = (listProps: Record<string, unknown>, rowProps: Record<string, unknown> = {}) => {
    return mount(EDataList, {
      props: listProps,
      slots: {
        default: h(EDataRow, rowProps),
      },
    });
  };

  it("elevates rows with sm by default and keeps the border opt-in", () => {
    const row = mountList({}).findComponent(EDataRow);

    expect(row.classes()).toContain("e-elevation--sm");
    expect(row.classes()).not.toContain("e-data-row--outlined");
  });

  it("propagates rowElevation and rowOutlined to the rows", () => {
    const row = mountList({ rowElevation: "lg", rowOutlined: true }).findComponent(EDataRow);

    expect(row.classes()).toContain("e-elevation--lg");
    expect(row.classes()).toContain("e-data-row--outlined");
  });

  it("lets a row override the inherited configuration", () => {
    const row = mountList(
      { rowElevation: "lg", rowOutlined: true },
      { elevation: "none", outlined: false },
    ).findComponent(EDataRow);

    expect(row.classes().some((className) => className.startsWith("e-elevation--"))).toBe(false);
    expect(row.classes()).not.toContain("e-data-row--outlined");
  });

  it("flattens rows in divided mode unless rowElevation is explicit", () => {
    const dividedRow = mountList({ divided: true }).findComponent(EDataRow);
    const explicitRow = mountList({ divided: true, rowElevation: "md" }).findComponent(EDataRow);

    expect(dividedRow.classes().some((className) => className.startsWith("e-elevation--"))).toBe(
      false,
    );
    expect(explicitRow.classes()).toContain("e-elevation--md");
  });

  it("applies its own box modifiers", () => {
    const wrapper = mount(EDataList, { props: { outlined: true, elevation: "md", divided: true } });

    expect(wrapper.classes()).toContain("e-data-list--outlined");
    expect(wrapper.classes()).toContain("e-data-list--divided");
    expect(wrapper.classes()).toContain("e-elevation--md");
  });
});
