import type { App, Component, Directive } from "vue";
import * as _components from "./components";
import * as _directives from "./directives";
import type { Locale, LocaleCode } from "./locales";
import { registerLocales, setDefaultLocaleCode } from "./locales";
import type { ThemePluginOptions } from "./theme";
import { installTheme } from "./theme";
import type { IconPath } from "./types";
import { registerIcons } from "./utils/icons";

export interface NuvexUIInstallOptions {
  icons?: Record<string, IconPath | string | Array<IconPath>>;
  locales?: Record<string, Locale>;
  locale?: LocaleCode;
  components?: Record<string, Component>;
  theme?: ThemePluginOptions;
}

export function install(Vue: App, args: NuvexUIInstallOptions = {}): void {
  registerIcons(args.icons);
  registerLocales(args.locales);
  installTheme(Vue, args.theme);

  if (args.locale) {
    setDefaultLocaleCode(args.locale);
  }

  const directives = _directives as Record<string, Directive>;
  for (const key in directives) {
    Vue.directive(key, directives[key]);
  }

  const components =
    args.components || (_components as Record<string, Component>);

  (function registerComponents(components: Record<string, Component>) {
    if (components) {
      for (const key in components) {
        Vue.component(key, components[key]);
      }

      return true;
    }
    return false;
  })(components);
}
