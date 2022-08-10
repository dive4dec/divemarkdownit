import MarkdownIt from 'markdown-it';
import { RenderedMarkdown } from './markdown-it/widget';

/**
 * A handle for the original createRenderer for restoring default behavior
 */
export namespace IMarkdown {
  export interface IPlugin {
    (md: MarkdownIt, ...params: any[]): void;
  }
  
  type TPluginOptions = object;
  export interface IPluginProvider {
    /**
     * A unique identifier for the plugin, usually the name of the upstream package
     */
    id: string;
    /**
     * A human-readable name for the plugin
     */
    title: string;
    /**
     * A short description for the plugin
     */
    description: string;
    /**
     * URLs for learning more about the plugin with human-readable keys
     */
    documentationUrls: { [key: string]: string };
    /**
     * Short usage examples of any new syntax with human-readable keys
     */
    examples?: { [key: string]: string };
    /**
     * A lazy provider of the plugin function and plugin options
     */
    plugin(): Promise<[IPlugin, ...any]>;
    /**
     * Additional options to pass to the MarkdownIt constructor
     */
    options?(widget: RenderedMarkdown): Promise<TPluginOptions>;
  }
  
  export interface IAllPluginOptions {
    [key: string]: any[];
  }

  /**
   * A manager for adding MarkdownIt plugins
   */
  export interface IMarkdownManager {
    addPluginProvider(provider: IPluginProvider): void;
    removePluginProvider(id: string): void;
    getPluginProvider(id: string): IPluginProvider | null;
    getMarkdownIt(
      widget: RenderedMarkdown,
      options?: MarkdownIt.Options
    ): Promise<MarkdownIt>;
    pluginProviderIds: string[];
  }
}