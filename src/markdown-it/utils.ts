import { JupyterFrontEndPlugin } from '@jupyterlab/application';

import { IMarkdown } from '../manager';
import { IMarkdownManager } from './values'

/**
 * Convenience method for building JupyterLab MarkdownIt plugins
 */
export function simpleMarkdownItPlugin(
  packageName: string,
  provider: IMarkdown.IPluginProvider
): JupyterFrontEndPlugin<void> {
  return {
    id: `${packageName}:${provider.id}`,
    autoStart: true,
    requires: [IMarkdownManager],
    activate: (app, markdownIt: IMarkdown.IMarkdownManager) => {
      markdownIt.addPluginProvider(provider);
    }
  };
}
