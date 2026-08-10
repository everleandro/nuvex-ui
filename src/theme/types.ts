import type { DeepReadonly, Ref } from "vue";

export type ThemeName = string;
export type ThemeTokenValue = string | number;

export interface ThemeDefinition {
  name: ThemeName;
  label?: string;
  isDark?: boolean;
  tokens?: Record<string, ThemeTokenValue>;
}

export type ThemeRegistry = Record<ThemeName, ThemeDefinition>;

export interface ThemeAttributeOptions {
  name?: string;
  darkValue?: string;
  lightValue?: string;
}

export interface ThemeStorageOptions {
  enabled?: boolean;
  key?: string;
  get?: () => ThemeName | undefined | null;
  set?: (themeName: ThemeName) => void;
}

export interface ThemeSystemOptions {
  enabled?: boolean;
  darkQuery?: string;
}

export interface ThemePluginOptions {
  themes?: ThemeRegistry;
  defaultTheme?: ThemeName;
  attribute?: ThemeAttributeOptions;
  storage?: ThemeStorageOptions;
  system?: ThemeSystemOptions;
  applyTokensAsCssVars?: boolean;
  cssVarPrefix?: string;
}

export interface ThemeContext {
  currentTheme: Ref<ThemeName>;
  availableThemes: DeepReadonly<ThemeRegistry>;
  setTheme: (name: ThemeName) => void;
  toggleTheme: (a?: ThemeName, b?: ThemeName) => void;
  hasTheme: (name: ThemeName) => boolean;
  getTheme: (name: ThemeName) => ThemeDefinition | undefined;
  getThemes: () => ThemeDefinition[];
  registerTheme: (theme: ThemeDefinition) => void;
  unregisterTheme: (name: ThemeName) => void;
  resetTheme: () => void;
}