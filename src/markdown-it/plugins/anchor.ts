import { simpleMarkdownItPlugin } from '../utils';
import { kPackageName } from '../values';

/**
 * Adds anchors to headers
 */
export const anchor = simpleMarkdownItPlugin(kPackageName, {
  id: 'markdown-it-anchor',
  title: 'Heading Anchors',
  description: 'Create clickable links for header elements',
  documentationUrls: {
    Plugin: 'https://github.com/valeriangalliat/markdown-it-anchor'
  },
  plugin: async () => {
    const anchorPlugin = await import(
      /* webpackChunkName: "markdown-it-anchor" */ 'markdown-it-anchor'
    );
    return [
      anchorPlugin.default,
      {
        // match JupyterLab default behavior
        permalink: true,
        permalinkClass: 'jp-InternalAnchorLink',
        slugify: (title: string): string => title.replace(/ /g, '-')
      }
    ];
  }
});
