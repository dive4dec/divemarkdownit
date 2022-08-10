import { Token } from '@lumino/coreutils';

import { markdownIcon, LabIcon } from '@jupyterlab/ui-components';

import { IMarkdown } from '../manager';


export const kPackageName = 'divemarkdownit';

export const kCommandCategory = 'Markdown Extensions';

export const kMarkupIcon = new LabIcon({
  name: `${kPackageName}:core`,
  svgstr: markdownIcon.svgstr.replace('jp-icon-contrast0', 'jp-icon-contrast1')
});

export const IMarkdownManager = new Token<IMarkdown.IMarkdownManager>(kPackageName);

export namespace CommandID {
  export const showSettings = 'markdown-it:show-settings';
  export const toggleRenderer = 'markdown-it:toggle-renderer';
}