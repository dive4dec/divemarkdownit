import { Signal } from '@lumino/signaling';

import { VDomModel, VDomRenderer } from '@jupyterlab/apputils';

import * as React from 'react';

import { IMarkdown } from '../manager'
import { MarkdownItManager } from './manager'


const kClassSettings = 'jp-MarkdownItSettings';
const kClassDocs = 'jp-MarkdownItSettings-Docs';
const kClassExamples = 'jp-MarkdownItSettings-Examples';
const kClassDisabled = 'jp-mu-mod-disabled';

const kIdStem = 'id-jp-mu';
const kIdGlobal = `${kIdStem}-global`;
const kIdPlugin = `${kIdStem}-plugin`;

export class Model extends VDomModel {
  advancedRequested = new Signal<Model, void>(this);
  _manager: MarkdownItManager;
  _disabledPlugins: string[] = [];
  _enabled = true;
  _providers: IMarkdown.IPluginProvider[] = [];

  dispose() {
    super.dispose();
    if (this._manager) {
      this._manager.settingsChanged.disconnect(this.onSettingsChanged, this);
      this._manager = null;
    }
  }

  get manager() {
    return this._manager;
  }

  set manager(manager) {
    this._manager = manager;
    if (manager) {
      manager.settingsChanged.connect(this.onSettingsChanged, this);
      this.onSettingsChanged();
    }
  }

  get disabledPlugins() {
    return this._disabledPlugins;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(enabled) {
    this._manager.settings.set('enabled', enabled);
  }

  get providers() {
    return this._providers;
  }

  setPluginEnabled(id: string, enabled: boolean) {
    const disabledPlugins = this._disabledPlugins.slice();
    const idx = disabledPlugins.indexOf(id);
    if (enabled) {
      disabledPlugins.splice(idx);
    } else {
      disabledPlugins.push(id);
    }
    if (disabledPlugins.length) {
      this.manager.settings.set('disabled-plugins', disabledPlugins);
    } else {
      this.manager.settings.remove('disabled-plugins');
    }
  }

  onSettingsChanged() {
    const { composite } = this.manager.settings;

    if (composite != null) {
      this._disabledPlugins = (composite['disabled-plugins'] ||
        []) as string[];

      this._enabled = composite['enabled'] as boolean;
      this._providers = this.manager.pluginProviderIds.map(
        this.manager.getPluginProvider,
        this.manager
      );
      this._providers.sort(this.sortByTitle);
    }

    this.stateChanged.emit(void 0);
  }

  sortByTitle(
    a: IMarkdown.IPluginProvider,
    b: IMarkdown.IPluginProvider
  ) {
    return a.title.localeCompare(b.title);
  }
}

export class MarkdownItSettings extends VDomRenderer<Model> {
  constructor(model: Model) {
    super(model);
    this.addClass(kClassSettings);
    this.addClass('jp-RenderedHTMLCommon');
  }

  dispose() {
    this.model?.dispose();
    super.dispose();
  }

  /**
   * Render the settings form
   */
  protected render() {
    const m = this.model;
    const manager = m?.manager;
    const advancedLink = (
      <a href="#" onClick={this.onAdvancedClicked}>
        Open in Advanced Settings...
      </a>
    );
    if (manager == null) {
      return <div />;
    }

    const { providers } = m;

    return (
      <div>
        <header>
          <ul>
            <li>
              <a href={`#${kIdGlobal}`}>Global</a>
            </li>
            <li>
              <a href={`#${kIdPlugin}`}>Markdown-it Plugins</a>
              <ul>{providers.map(this.renderPluginNav, this)}</ul>
            </li>
            <li>{advancedLink}</li>
          </ul>
        </header>
        <article>
          <section id={kIdGlobal}>
            <h3>Global</h3>
            <label>
              <input
                type="checkbox"
                defaultChecked={m.enabled}
                onChange={this.onEnabledChanged}
              />
              Use <code>markdown-it</code>
            </label>
            <blockquote>
              Enable to use the <code>markdown-it</code> Markdown renderer and
              extensions for any new renderers.
            </blockquote>
          </section>
          <h3 id={kIdPlugin}>Markdown-it Plugins</h3>
          <blockquote>
            Extensions can be individually enabled or disabled with the
            checkboxes below. See {advancedLink} for more fine-grained control.
          </blockquote>
          {providers.map(this.renderPluginProvider, this)}
        </article>
      </div>
    );
  }

  /**
   * Render a single plugin provider nav link
   */
  protected renderPluginNav(provider: IMarkdown.IPluginProvider) {
    const m = this.model;
    const enabled = m.disabledPlugins.indexOf(provider.id) === -1;
    const navClass = enabled && m.enabled ? '' : kClassDisabled;

    return (
      <li key={provider.id} className={navClass}>
        <a href={`#${kIdPlugin}-${provider.id}`}>{provider.title}</a>
      </li>
    );
  }

  /**
   * Render a single plugin provider section
   */
  protected renderPluginProvider(provider: IMarkdown.IPluginProvider) {
    const m = this.model;
    const enabled = m.disabledPlugins.indexOf(provider.id) === -1;
    const sectionClass = enabled && m.enabled ? '' : kClassDisabled;

    const docs = [];
    const examples = [];

    for (const label in provider.documentationUrls) {
      docs.push(this.renderDoc(label, provider.documentationUrls[label]));
    }

    for (const label in provider.examples || {}) {
      examples.push(this.renderExample(label, provider.examples[label]));
    }

    return (
      <section
        key={provider.id}
        id={`${kIdPlugin}-${provider.id}`}
        className={sectionClass}
      >
        <div>
          <h4 title={`plugin id: ${provider.id}`}>
            <label>
              <input
                type="checkbox"
                value={provider.id}
                defaultChecked={enabled}
                onChange={this.onPluginEnabledChanged}
              />
              {provider.title}
            </label>
          </h4>
          <ul className={kClassDocs}>{docs}</ul>
        </div>
        <blockquote>{provider.description}</blockquote>
        <ul className={kClassExamples}>{examples}</ul>
      </section>
    );
  }

  protected renderDoc(label: string, url: string) {
    return (
      <li key={url}>
        <a href={url} target="_blank" rel="noopener">
          {label}
        </a>
      </li>
    );
  }

  protected renderExample(label: string, code: string) {
    return (
      <div key={label}>
        <p>
          <label>
            <em>{label}</em>
          </label>
        </p>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  protected onPluginEnabledChanged = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = evt.currentTarget;
    this.model.setPluginEnabled(value, checked);
  };

  protected onEnabledChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.model.enabled = evt.currentTarget.checked;
  };

  onAdvancedClicked = () => {
    this.model.advancedRequested.emit(void 0);
  };
}