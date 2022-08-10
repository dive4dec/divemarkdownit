import { simpleMarkdownItPlugin } from '../utils';
import { kPackageName } from '../values';

/**
 * Draw diagrams 
 */
export const diagrams = simpleMarkdownItPlugin(kPackageName, {
  id: 'markdown-it-diagrams',
  title: 'Drawing Diagrams',
  description: 'Draw diagrams with mermaid and railroad',
  documentationUrls: {
    Plugin: 'https://github.com/valeriangalliat/markdown-it-anchor'
  },
  examples: {
    'Railroad': `
\`\`\`railroad
Diagram(
  Optional('+', 'skip'),
  Choice(0,
    NonTerminal('name-start char'),
    NonTerminal('escape')),
  ZeroOrMore(
    Choice(0,
      NonTerminal('name char'),
      NonTerminal('escape'))))
\`\`\`
`
  },
  plugin: async () => {
    const diagramsPlugin = await import(
      /* webpackChunkName: "markdown-it-diagrams" */ 'markdown-it-diagrams'
    );
    return [diagramsPlugin.default];
  }
});
