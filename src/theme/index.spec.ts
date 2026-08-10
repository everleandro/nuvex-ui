import { afterEach, describe, expect, it, vi } from "vitest";
import { createTheme } from "./index";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();

  if (typeof document !== "undefined") {
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.style.removeProperty("--e-theme-brand");
    document.documentElement.style.removeProperty("color-scheme");
  }

  if (typeof window !== "undefined") {
    window.localStorage.clear();
  }
});

describe("theme", () => {
  it("provides light and dark by default", () => {
    const theme = createTheme();

    expect(theme.hasTheme("light")).toBe(true);
    expect(theme.hasTheme("dark")).toBe(true);
  });

  it("applies the selected theme to data-theme", () => {
    const theme = createTheme();

    theme.setTheme("dark");

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(theme.currentTheme.value).toBe("dark");
  });

  it("registers custom themes and ignores overriding built-ins", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const theme = createTheme({
      themes: {
        light: { name: "light", isDark: true },
        ocean: { name: "ocean", tokens: { brand: "#0077cc" } },
      },
      applyTokensAsCssVars: true,
    });

    expect(theme.hasTheme("ocean")).toBe(true);
    expect(theme.getTheme("light")?.isDark).toBe(false);
    expect(warn).toHaveBeenCalled();

    theme.setTheme("ocean");
    expect(document.documentElement.getAttribute("data-theme")).toBe("ocean");
    expect(
      document.documentElement.style.getPropertyValue("--e-theme-brand"),
    ).toBe("#0077cc");

    theme.setTheme("light");
    expect(
      document.documentElement.style.getPropertyValue("--e-theme-brand"),
    ).toBe("");
  });

  it("restores current theme from localStorage", () => {
    window.localStorage.setItem("nuvex-ui:theme", "dark");

    const theme = createTheme();

    expect(theme.currentTheme.value).toBe("dark");
  });

  it("restores current theme from custom storage without browser globals", () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("document", undefined);

    const theme = createTheme({
      storage: {
        get: () => "dark",
      },
    });

    expect(theme.currentTheme.value).toBe("dark");
  });

  it("persists the selected theme through custom storage", () => {
    const set = vi.fn();
    const theme = createTheme({
      storage: {
        get: () => "light",
        set,
      },
    });

    theme.setTheme("dark");

    expect(set).toHaveBeenCalledWith("dark");
  });

  it("is safe to create without browser globals", () => {
    vi.stubGlobal("window", undefined);
    vi.stubGlobal("document", undefined);

    expect(() => createTheme()).not.toThrow();
    expect(createTheme().currentTheme.value).toBe("light");
  });
});