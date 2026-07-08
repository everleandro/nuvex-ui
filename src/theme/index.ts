import {
  inject,
  provide,
  reactive,
  readonly,
  ref,
  type App,
  type DeepReadonly,
  type InjectionKey,
} from "vue";
import type {
  ThemeContext,
  ThemeDefinition,
  ThemeName,
  ThemePluginOptions,
  ThemeRegistry,
} from "./types";

const DEFAULT_ATTRIBUTE_NAME = "data-theme";
const DEFAULT_STORAGE_KEY = "nuvex-ui:theme";
const DEFAULT_DARK_QUERY = "(prefers-color-scheme: dark)";
const DEFAULT_CSS_VAR_PREFIX = "--e-theme-";

const BASE_THEME_NAMES = new Set<ThemeName>(["light", "dark"]);

const BASE_THEMES: ThemeRegistry = {
  light: {
    name: "light",
    label: "Light",
    isDark: false,
  },
  dark: {
    name: "dark",
    label: "Dark",
    isDark: true,
  },
};

const isClientEnvironment = (): boolean => {
  return typeof window !== "undefined" && typeof document !== "undefined";
};

const isDevelopmentEnvironment = (): boolean => {
  return typeof process !== "undefined" && process.env.NODE_ENV !== "production";
};

const warnTheme = (message: string): void => {
  if (isDevelopmentEnvironment()) {
    console.warn(`[nuvex-ui:theme] ${message}`);
  }
};

const normalizeThemeName = (value?: unknown): string => {
  return typeof value === "string" ? value.trim() : "";
};

const resolveCustomStoredTheme = (
  themes: ThemeRegistry,
  options: ThemePluginOptions,
): ThemeName | undefined => {
  if (options.storage?.enabled === false || typeof options.storage?.get !== "function") {
    return undefined;
  }

  try {
    const storedValue = options.storage.get();
    const normalizedStored = normalizeThemeName(storedValue || undefined);

    return normalizedStored && themes[normalizedStored]
      ? normalizedStored
      : undefined;
  } catch {
    return undefined;
  }
};

const normalizeThemeDefinition = (
  fallbackName: string,
  theme?: ThemeDefinition,
): ThemeDefinition => {
  const name = normalizeThemeName(theme?.name || fallbackName);

  return {
    name,
    label: theme?.label,
    isDark: theme?.isDark,
    tokens: theme?.tokens,
  };
};

const getThemeFallback = (
  themes: ThemeRegistry,
  defaultTheme?: ThemeName,
): ThemeName => {
  const normalizedDefault = normalizeThemeName(defaultTheme);

  if (normalizedDefault && themes[normalizedDefault]) {
    return normalizedDefault;
  }

  if (themes.light) {
    return "light";
  }

  return Object.keys(themes)[0] || "light";
};

const resolveStoredTheme = (
  themes: ThemeRegistry,
  options: ThemePluginOptions,
): ThemeName | undefined => {
  const customStoredTheme = resolveCustomStoredTheme(themes, options);
  if (customStoredTheme) {
    return customStoredTheme;
  }

  if (!isClientEnvironment()) {
    return undefined;
  }

  if (options.storage?.enabled === false) {
    return undefined;
  }

  try {
    const key = options.storage?.key || DEFAULT_STORAGE_KEY;
    const storedValue = window.localStorage.getItem(key);
    const normalizedStored = normalizeThemeName(storedValue || undefined);

    return normalizedStored && themes[normalizedStored]
      ? normalizedStored
      : undefined;
  } catch {
    return undefined;
  }
};

const resolveSystemTheme = (
  themes: ThemeRegistry,
  options: ThemePluginOptions,
): ThemeName | undefined => {
  if (!isClientEnvironment()) {
    return undefined;
  }

  if (options.system?.enabled === false || typeof window.matchMedia !== "function") {
    return undefined;
  }

  try {
    const prefersDark = window.matchMedia(
      options.system?.darkQuery || DEFAULT_DARK_QUERY,
    ).matches;

    if (prefersDark && themes.dark) {
      return "dark";
    }

    if (!prefersDark && themes.light) {
      return "light";
    }
  } catch {
    return undefined;
  }

  return undefined;
};

const resolveInitialTheme = (
  themes: ThemeRegistry,
  options: ThemePluginOptions,
): ThemeName => {
  const storedTheme = resolveStoredTheme(themes, options);
  if (storedTheme) {
    return storedTheme;
  }

  const systemTheme = resolveSystemTheme(themes, options);
  if (systemTheme) {
    return systemTheme;
  }

  return getThemeFallback(themes, options.defaultTheme);
};

const resolveThemeAttributeValue = (
  themeName: ThemeName,
  options: ThemePluginOptions,
): string => {
  if (themeName === "dark") {
    return options.attribute?.darkValue || "dark";
  }

  if (themeName === "light") {
    return options.attribute?.lightValue || "light";
  }

  return themeName;
};

const resolveCssVariableName = (token: string, prefix: string): string => {
  return token.startsWith("--") ? token : `${prefix}${token}`;
};

export const createTheme = (rawOptions: ThemePluginOptions = {}): ThemeContext => {
  const options: ThemePluginOptions = {
    ...rawOptions,
    attribute: {
      name: DEFAULT_ATTRIBUTE_NAME,
      ...rawOptions.attribute,
    },
    storage: {
      enabled: true,
      key: DEFAULT_STORAGE_KEY,
      ...rawOptions.storage,
    },
    system: {
      enabled: true,
      darkQuery: DEFAULT_DARK_QUERY,
      ...rawOptions.system,
    },
    applyTokensAsCssVars: rawOptions.applyTokensAsCssVars ?? false,
    cssVarPrefix: rawOptions.cssVarPrefix || DEFAULT_CSS_VAR_PREFIX,
  };

  const themeRegistry = reactive<ThemeRegistry>({
    light: { ...BASE_THEMES.light },
    dark: { ...BASE_THEMES.dark },
  });

  const managedTokenNames = new Set<string>();

  const appendTheme = (name: string, theme?: ThemeDefinition): void => {
    const normalizedTheme = normalizeThemeDefinition(name, theme);
    if (!normalizedTheme.name) {
      return;
    }

    if (BASE_THEME_NAMES.has(normalizedTheme.name)) {
      warnTheme(
        `"${normalizedTheme.name}" is a built-in theme and cannot be re-registered through theme options.`,
      );
      return;
    }

    if (themeRegistry[normalizedTheme.name]) {
      warnTheme(
        `"${normalizedTheme.name}" is already registered. Duplicate theme definitions are ignored.`,
      );
      return;
    }

    themeRegistry[normalizedTheme.name] = normalizedTheme;
  };

  for (const [name, theme] of Object.entries(options.themes || {})) {
    appendTheme(name, theme);
  }

  const currentTheme = ref<ThemeName>(resolveInitialTheme(themeRegistry, options));

  const applyThemeTokens = (theme: ThemeDefinition | undefined): void => {
    if (!isClientEnvironment()) {
      return;
    }

    const root = document.documentElement;
    const nextTokens = theme?.tokens || {};
    const prefix = options.cssVarPrefix || DEFAULT_CSS_VAR_PREFIX;
    const nextTokenNames = new Set<string>();

    for (const token of Object.keys(nextTokens)) {
      const variableName = resolveCssVariableName(token, prefix);
      nextTokenNames.add(variableName);
      root.style.setProperty(variableName, String(nextTokens[token]));
      managedTokenNames.add(variableName);
    }

    for (const variableName of Array.from(managedTokenNames)) {
      if (nextTokenNames.has(variableName)) {
        continue;
      }

      root.style.removeProperty(variableName);
      managedTokenNames.delete(variableName);
    }
  };

  const applyThemeToDom = (themeName: ThemeName): void => {
    if (!isClientEnvironment()) {
      return;
    }

    const theme = themeRegistry[themeName];
    const root = document.documentElement;
    root.setAttribute(
      options.attribute?.name || DEFAULT_ATTRIBUTE_NAME,
      resolveThemeAttributeValue(themeName, options),
    );

    if (typeof theme?.isDark === "boolean") {
      root.style.setProperty("color-scheme", theme.isDark ? "dark" : "light");
    } else {
      root.style.removeProperty("color-scheme");
    }

    if (options.applyTokensAsCssVars) {
      applyThemeTokens(theme);
    }
  };

  const persistTheme = (themeName: ThemeName): void => {
    if (options.storage?.enabled === false) {
      return;
    }

    if (typeof options.storage?.set === "function") {
      try {
        options.storage.set(themeName);
      } catch {
        // no-op: custom storage adapters can be unavailable during SSR transitions.
      }
      return;
    }

    if (!isClientEnvironment()) {
      return;
    }

    try {
      window.localStorage.setItem(
        options.storage?.key || DEFAULT_STORAGE_KEY,
        themeName,
      );
    } catch {
      // no-op: localStorage can be unavailable in private/restricted contexts.
    }
  };

  const hasTheme = (name: ThemeName): boolean => {
    return Boolean(themeRegistry[normalizeThemeName(name)]);
  };

  const getTheme = (name: ThemeName): ThemeDefinition | undefined => {
    const normalizedName = normalizeThemeName(name);
    return normalizedName ? themeRegistry[normalizedName] : undefined;
  };

  const getThemes = (): ThemeDefinition[] => {
    return Object.values(themeRegistry);
  };

  const setTheme = (name: ThemeName): void => {
    const normalizedName = normalizeThemeName(name);

    if (!normalizedName || !themeRegistry[normalizedName]) {
      warnTheme(`Cannot set unknown theme "${name}".`);
      return;
    }

    currentTheme.value = normalizedName;
    applyThemeToDom(normalizedName);
    persistTheme(normalizedName);
  };

  const toggleTheme = (a?: ThemeName, b?: ThemeName): void => {
    const first = hasTheme(a || "")
      ? normalizeThemeName(a)
      : hasTheme("light")
        ? "light"
        : getThemes()[0]?.name;

    const second = hasTheme(b || "")
      ? normalizeThemeName(b)
      : hasTheme("dark")
        ? "dark"
        : getThemes().find((theme) => theme.name !== first)?.name;

    if (!first || !second || first === second) {
      return;
    }

    setTheme(currentTheme.value === first ? second : first);
  };

  const registerTheme = (theme: ThemeDefinition): void => {
    const normalizedTheme = normalizeThemeDefinition(theme.name, theme);

    if (!normalizedTheme.name) {
      warnTheme("Cannot register a theme without a valid name.");
      return;
    }

    appendTheme(normalizedTheme.name, normalizedTheme);
  };

  const unregisterTheme = (name: ThemeName): void => {
    const normalizedName = normalizeThemeName(name);
    if (!normalizedName || !themeRegistry[normalizedName]) {
      return;
    }

    if (BASE_THEME_NAMES.has(normalizedName)) {
      warnTheme(`"${normalizedName}" is built-in and cannot be removed.`);
      return;
    }

    delete themeRegistry[normalizedName];

    if (currentTheme.value === normalizedName) {
      setTheme(getThemeFallback(themeRegistry, options.defaultTheme));
    }
  };

  const resetTheme = (): void => {
    setTheme(getThemeFallback(themeRegistry, options.defaultTheme));
  };

  return {
    currentTheme,
    availableThemes: readonly(themeRegistry) as DeepReadonly<ThemeRegistry>,
    setTheme,
    toggleTheme,
    hasTheme,
    getTheme,
    getThemes,
    registerTheme,
    unregisterTheme,
    resetTheme,
  };
};

export const themeInjectionKey: InjectionKey<ThemeContext> =
  Symbol("nuvex-ui-theme");

const fallbackThemeContext = createTheme({
  storage: { enabled: false },
  system: { enabled: false },
});

export const installTheme = (
  app: App,
  options: ThemePluginOptions = {},
): ThemeContext => {
  const theme = createTheme(options);
  app.provide(themeInjectionKey, theme);
  theme.setTheme(theme.currentTheme.value);
  return theme;
};

export const provideTheme = (
  options: ThemePluginOptions = {},
): ThemeContext => {
  const theme = createTheme(options);
  provide(themeInjectionKey, theme);
  theme.setTheme(theme.currentTheme.value);
  return theme;
};

export const useTheme = (): ThemeContext => {
  return inject(themeInjectionKey, fallbackThemeContext);
};

export type {
  ThemeAttributeOptions,
  ThemeContext,
  ThemeDefinition,
  ThemeName,
  ThemePluginOptions,
  ThemeRegistry,
  ThemeStorageOptions,
  ThemeSystemOptions,
  ThemeTokenValue,
} from "./types";