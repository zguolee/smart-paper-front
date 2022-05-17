/**
 * https://github.com/antfu/unplugin-vue-components
 */

import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export function configComponentsPlugin() {
  return Components({
    // allow auto load markdown components under `./src/components/`
    extensions: ['vue', 'md'],
    // allow auto import and register components used in markdown
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    dts: 'src/components.d.ts',
    resolvers: [
      NaiveUiResolver(),
    ],
  })
}

