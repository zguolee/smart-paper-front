import type { PluginOption } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Unocss from 'unocss/vite'
import Inspect from 'vite-plugin-inspect'
import AutoImport from 'unplugin-auto-import/vite'
import { configMarkdownPlugin } from './markdown'
import { configMockPlugin } from './mock'
import { configPWAPlugin } from './pwa'
import { configComponentsPlugin } from './components'
import { configI18nPlugin } from './i18n'

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_USE_MOCK } = viteEnv

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // have to
    Vue({
      include: [/\.vue$/, /\.md$/],
      reactivityTransform: true,
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      dirs: 'src/pages',
      extensions: ['vue', 'md'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        'vue/macros',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
    }),

    // https://github.com/antfu/unocss
    // see unocss.config.ts for config
    Unocss(),

    // https://github.com/antfu/vite-plugin-inspect
    // Visit http://localhost:port/__inspect/ to see the inspector
    Inspect(),
  ]

  // unplugin-vue-components
  vitePlugins.push(configComponentsPlugin())

  // vite-plugin-md
  vitePlugins.push(configMarkdownPlugin())

  // VueI18n
  vitePlugins.push(configI18nPlugin())

  // console.log(configI18nPlugin())

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild))

  // vite-plugin-pwa
  vitePlugins.push(configPWAPlugin(viteEnv))

  return vitePlugins
}

