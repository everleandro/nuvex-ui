import { defineNuxtPlugin, useCookie, useHead, useRuntimeConfig } from '#imports'
import { NuvexUI } from 'nuvex-ui'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public.nuvexUI

  function readLegacyTheme(): string | undefined {
    if (import.meta.server) {
      return undefined
    }

    try {
      return window.localStorage.getItem(config.legacyStorageKey)?.trim() || undefined
    } catch {
      return undefined
    }
  }

  function readThemeCookie(): string | undefined {
    if (import.meta.server) {
      return undefined
    }

    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${config.cookieName}=([^;]+)`))
    return match?.[1] ? decodeURIComponent(match[1]).trim() : undefined
  }

  // Cookie is readable during SSR, so the server render and the first client
  // paint agree on the theme before nuvex-ui ever touches the DOM.
  const themeCookie = useCookie<string | undefined>(config.cookieName, {
    sameSite: 'lax',
    path: '/',
  })

  const initialTheme = themeCookie.value
    || readThemeCookie()
    || readLegacyTheme()
    || config.theme.defaultTheme
    || 'light'

  // Bake data-theme into the SSR HTML itself: nuvex-ui only sets it client-side,
  // so without this the page would flash the default theme until hydration.
  useHead({
    htmlAttrs: {
      'data-theme': initialTheme,
    },
  })

  nuxtApp.vueApp.use(NuvexUI, {
    locale: config.locale,
    locales: config.locales,
    icons: config.icons,
    theme: {
      ...config.theme,
      defaultTheme: initialTheme,
      storage: {
        get: () => (import.meta.server ? themeCookie.value : (readThemeCookie() || readLegacyTheme())),
        set: (themeName: string) => {
          themeCookie.value = themeName

          try {
            window.localStorage.setItem(config.legacyStorageKey, themeName)
          } catch {
            // Ignore restricted storage access and keep the cookie as source of truth.
          }
        },
      },
    },
  })
})
