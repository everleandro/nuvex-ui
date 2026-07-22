import { describe, expect, it } from "vitest";

import {
  getColorContrastCssValue,
  getColorCssValue,
  resolveColorCssVariable,
} from "./style";

describe("resolveColorCssVariable", () => {
  it("resolves semantic colors with semantic contrast variables", () => {
    expect(resolveColorCssVariable("primary")).toEqual({
      kind: "semantic",
      variableName: "--e-color-primary",
      value: "var(--e-color-primary)",
      contrastVariableName: "--e-contrast-primary",
      contrastValue: "var(--e-contrast-primary, white)",
    });
  });

  it("resolves primitive tones with a complementary palette tone", () => {
    expect(resolveColorCssVariable("green-100")).toEqual({
      kind: "primitive",
      variableName: "--e-palette-green-100",
      value: "var(--e-palette-green-100)",
      contrastVariableName: "--e-palette-contrast-green-100",
      contrastValue:
        "var(--e-palette-contrast-green-100, var(--e-palette-green-900, white))",
    });
  });

  it("resolves primitive families with a complementary palette tone", () => {
    expect(resolveColorCssVariable("green")).toEqual({
      kind: "primitive",
      variableName: "--e-palette-green",
      value: "var(--e-palette-green)",
      contrastVariableName: "--e-palette-contrast-green",
      contrastValue:
        "var(--e-palette-contrast-green, var(--e-palette-green-50, white))",
    });
  });

  it("keeps semantic preference available for ambiguous family names", () => {
    expect(resolveColorCssVariable("green", { prefer: "semantic" })).toEqual({
      kind: "semantic",
      variableName: "--e-color-green",
      value: "var(--e-color-green)",
      contrastVariableName: "--e-contrast-green",
      contrastValue: "var(--e-contrast-green, white)",
    });
  });
});

describe("color css helpers", () => {
  it("returns primitive css values with complementary palette contrast", () => {
    expect(getColorCssValue("green-100")).toBe("var(--e-palette-green-100)");
    expect(getColorContrastCssValue("green-100")).toBe(
      "var(--e-palette-contrast-green-100, var(--e-palette-green-900, white))",
    );
  });
});