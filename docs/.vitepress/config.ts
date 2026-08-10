import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  title: 'Nuvex UI',
  description: 'Vue 3 UI component library',
  lang: 'es-ES',
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../src', import.meta.url)),
        '~': fileURLToPath(new URL('../../', import.meta.url)),
      },
    },
    server: {
      port: 5176,
      strictPort: true,
      watch: {
        usePolling: true,
        interval: 150,
      },
    },
  },
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'Guia', link: '/getting-started' },
      { text: 'Componentes', link: '/components/' }
    ],
    sidebar: [
      {
        text: 'Fundamentos',
        items: [
          { text: 'Inicio', link: '/' },
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'Theming', link: '/theming' },
          { text: 'Utilities', link: '/utilities' }
        ]
      },
      {
        text: 'Componentes',
        items: [
          { text: 'Indice', link: '/components/' },
          { text: 'Avatar', link: '/components/avatar' },
          { text: 'Button', link: '/components/button' },
          { text: 'Card', link: '/components/card' },
          { text: 'Checkbox', link: '/components/checkbox' },
          { text: 'Chip', link: '/components/chip' },
          { text: 'Date Picker', link: '/components/date-picker' },
          { text: 'Dialog', link: '/components/dialog' },
          { text: 'Form', link: '/components/form' },
          { text: 'Icon', link: '/components/icon' },
          { text: 'List', link: '/components/list' },
          { text: 'Progress', link: '/components/progress' },
          { text: 'Radio', link: '/components/radio' },
          { text: 'Schedule', link: '/components/schedule' },
          { text: 'Select', link: '/components/select' },
          { text: 'Switch', link: '/components/switch' },
          { text: 'Textfield', link: '/components/textfield' },
          { text: 'Time Picker', link: '/components/time-picker' }
        ]
      }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/everleandro/nuvex-ui' }]
  }
})
