/**
 * https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
 */

import path from 'path'
import VueI18n from '@intlify/vite-plugin-vue-i18n'

export function configI18nPlugin() {
  return VueI18n({
    runtimeOnly: true,
    compositionOnly: true,
    include: [path.resolve(process.cwd(), 'locales/**')],
  })
}

