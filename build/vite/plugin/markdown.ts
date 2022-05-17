/**
 * https://github.com/antfu/vite-plugin-md
 */

import Markdown from 'vite-plugin-md'
import Prism from 'markdown-it-prism'
import LinkAttributes from 'markdown-it-link-attributes'

const markdownWrapperClasses = 'prose prose-sm m-auto text-left'

export function configMarkdownPlugin() {
  return Markdown({
    wrapperClasses: markdownWrapperClasses,
    headEnabled: true,
    markdownItSetup(md) {
    // https://prismjs.com/
      md.use(Prism)
      md.use(LinkAttributes, {
        matcher: (link: string) => /^https?:\/\//.test(link),
        attrs: {
          target: '_blank',
          rel: 'noopener',
        },
      })
    },
  })
}

