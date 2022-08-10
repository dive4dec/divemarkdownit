import { RenderedHTMLCommon } from '@jupyterlab/rendermime';
import { IRenderMime } from '@jupyterlab/rendermime-interfaces';
import { removeMath, renderHTML, replaceMath } from '@jupyterlab/rendermime';

import { Message } from '@lumino/messaging';
// import * as renderers from './renderers';
import MarkdownIt from 'markdown-it';
import { IMarkdown } from '../manager';

/**
 * A mime renderer for displaying Markdown with embedded latex.
 */
export class RenderedMarkdown extends RenderedHTMLCommon {
  /**
   * Construct a new rendered markdown widget.
   *
   * @param options - The options for initializing the widget.
   */
  md: MarkdownIt;

  /**
   * A static manager set by the core plugin for getting MarkdownIt instances
   */
  static markdownItManager: IMarkdown.IMarkdownManager;

  constructor(options: IRenderMime.IRendererOptions) {
    super(options);
    this.addClass('jp-RenderedMarkdown');
  }

  /**
   * Render a mime model.
   *
   * @param model - The mime model to render.
   *
   * @returns A promise which resolves when rendering is complete.
   */
  async render(model: IRenderMime.IMimeModel): Promise<void> {
    if (this.md == null) {
      this.md = await RenderedMarkdown.markdownItManager.getMarkdownIt(this);
    }
    let markdown = String(model.data[this.mimeType]);
    let text_and_math = removeMath(markdown);
    let text = text_and_math['text'];
    let html = this.md.render(text);
    html = replaceMath(html, text_and_math['math']);

    return await renderHTML({
      host: this.node,
      source: html,
      trusted: model.trusted,
      resolver: this.resolver,
      sanitizer: this.sanitizer,
      linkHandler: this.linkHandler,
      shouldTypeset: this.isAttached,
      latexTypesetter: this.latexTypesetter
    });
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   */
  onAfterAttach(msg: Message): void {
    if (this.latexTypesetter) {
      this.latexTypesetter.typeset(this.node);
    }
  }
}
