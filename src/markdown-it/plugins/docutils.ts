import { simpleMarkdownItPlugin } from '../utils';
import { kPackageName } from '../values';

/**
 * Provides docutils
 */
export const docutils = simpleMarkdownItPlugin(kPackageName, {
  id: 'markdown-it-docutils',
  title: 'MyST',
  description: 'Use MyST syntax Markdown (limited) in JupyterLab',
  documentationUrls: {
    Plugin: 'https://github.com/executablebooks/markdown-it-docutils'
  },
  examples: {
    'Directives and roles': `
Unhandled role: {unknown}\`content\` in paragraph.

Raw role: {raw}\`content\`

Unhandled directive:

\`\`\`{unknown} argument
content
\`\`\`

Erroneous directive:

\`\`\`{admonition}
\`\`\`

Admonition with title

\`\`\`{admonition} A **Title**
Some *content*
\`\`\`

Nested admonitions:

\`\`\`\`{note} This is a note
\`\`\`{warning} This is a nested warning
\`\`\`
\`\`\`\`

Images and figures:

\`\`\`{image} https://via.placeholder.com/150
:align: center
\`\`\`

\`\`\`{figure} https://via.placeholder.com/150
:align: center

A **caption**
\`\`\`

Tables:

\`\`\`{list-table} Caption *text*
:header-rows: 1

- * Heading, Column 1
  * Heading, Column 2
- * Row, Column 1
  * Row, Column 2

    Second paragraph
\`\`\`

HTML:

* H{sub}\`2\`O
* 4{sup}\`th\` of July
* {abbr}\`CSS (Cascading Style Sheets)\`
          
Math:
          
\`\`\`{math}
:label: math_label
w_{t+1} = (1 + r_{t+1}) s(w_t) + y_{t+1}    
\`\`\`
`
  },
  plugin: async () => {
    const docutilsPlugin = await import(
      /* webpackChunkName: "markdown-it-docutils" */ 'markdown-it-docutils'
    );
    return [docutilsPlugin.default];
  }
});
