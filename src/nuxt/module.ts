import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { IconPath, Locale, LocaleCode, ThemePluginOptions } from '../index'

export interface NuvexUIModuleOptions {
  /** Cookie used to persist the active theme across SSR requests. @default 'nuvex-ui-theme' */
  cookieName?: string
  /** Legacy client-only storage key kept for users upgrading from the manual plugin setup. @default 'nuvex-ui:theme' */
  legacyStorageKey?: string
  /** Auto-register `nuvex-ui/styles.css` and `nuvex-ui/framework.scss`. @default true */
  css?: boolean
  theme?: Omit<ThemePluginOptions, 'storage'>
  locale?: LocaleCode
  locales?: Record<string, Locale>
  icons?: Record<string, IconPath | string | Array<IconPath>>
}

export interface NuvexUIPublicRuntimeConfig {
  cookieName: string
  legacyStorageKey: string
  theme: Omit<ThemePluginOptions, 'storage'>
  locale?: LocaleCode
  locales?: Record<string, Locale>
  icons?: Record<string, IconPath | string | Array<IconPath>>
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    nuvexUI: NuvexUIPublicRuntimeConfig
  }
}

export default defineNuxtModule<NuvexUIModuleOptions>({
  meta: {
    name: 'nuvex-ui',
    configKey: 'nuvexUI',
  },
  defaults: {
    cookieName: 'nuvex-ui-theme',
    legacyStorageKey: 'nuvex-ui:theme',
    css: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (options.css) {
      nuxt.options.css.push('nuvex-ui/styles.css', 'nuvex-ui/framework.scss')
    }

    nuxt.options.runtimeConfig.public.nuvexUI = {
      cookieName: options.cookieName!,
      legacyStorageKey: options.legacyStorageKey!,
      theme: options.theme ?? {},
      locale: options.locale,
      locales: options.locales,
      icons: options.icons,
    }

    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
