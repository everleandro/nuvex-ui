import { describe, expect, it } from "vitest";

import { resolveMenuWidth } from "./sizing";

describe("resolveMenuWidth", () => {
  it("uses intrinsic content width when fitContent is enabled", () => {
    expect(resolveMenuWidth({
      activatorWidth: 500,
      contentWidth: 290,
      fitContent: true,
    })).toBe(290);
  });

  it("keeps the default width at least as wide as the activator", () => {
    expect(resolveMenuWidth({
      activatorWidth: 500,
      contentWidth: 290,
    })).toBe(500);
  });

  it("gives fullWidth and explicit width precedence over fitContent", () => {
    expect(resolveMenuWidth({
      activatorWidth: 500,
      contentWidth: 290,
      explicitWidth: 360,
      fitContent: true,
    })).toBe(360);

    expect(resolveMenuWidth({
      activatorWidth: 500,
      contentWidth: 290,
      explicitWidth: 360,
      fitContent: true,
      fullWidth: true,
    })).toBe(500);
  });
});