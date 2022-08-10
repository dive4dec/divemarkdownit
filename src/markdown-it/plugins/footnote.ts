import { simpleMarkdownItPlugin } from '../utils';
import { kPackageName } from '../values';

/**
 * Provides footnotes
 */
export const footnote = simpleMarkdownItPlugin(kPackageName, {
  id: 'markdown-it-footnote',
  title: 'Footnotes',
  description: 'Create links notes that appear after the current paragraph',
  documentationUrls: {
    Plugin: 'https://github.com/markdown-it/markdown-it-footnote'
  },
  examples: {
    'Footnote': `
Here is a footnote reference,[^1] and another.[^longnote]

[^1]: Here is the footnote.

[^longnote]: Here's one with multiple blocks.

  Subsequent paragraphs are indented to show that they
belong to the previous footnote.
`
  },
  plugin: async () => {
    const footnotePlugin = await import(
      /* webpackChunkName: "markdown-it-footnote" */ 'markdown-it-footnote'
    );
    return [footnotePlugin.default];
  }
});
