import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { MainAreaWidget, ICommandPalette } from '@jupyterlab/apputils';
import { IMainMenu } from '@jupyterlab/mainmenu';

import { MarkdownItSettings, Model } from './setting';
import { IMarkdown } from '../manager';
import { MarkdownItManager } from './manager';
import { RenderedMarkdown } from './widget';
import { kPackageName, kMarkupIcon, kCommandCategory, CommandID, IMarkdownManager } from './values';

import { plugins } from './plugins';


const core: JupyterFrontEndPlugin<IMarkdown.IMarkdownManager> = {

  id: `${kPackageName}:core`,
  autoStart: true,
  provides: IMarkdownManager,
  requires: [ISettingRegistry, ICommandPalette],
  optional: [IMainMenu],
  activate: (
    app: JupyterFrontEnd,
    settings: ISettingRegistry,
    palette: ICommandPalette,
    menu?: IMainMenu
  ) => {
    const { commands, shell } = app;
    const manager = new MarkdownItManager();
    // set the static manager
    RenderedMarkdown.markdownItManager = manager;
    // eventually load settings
    settings
      .load(core.id)
      .then(settings => (manager.settings = settings))
      .catch(console.warn);

    let settingsMain: MainAreaWidget;
    
    // commands
    commands.addCommand(CommandID.showSettings, {
      label: 'JupyterLab MarkdownIt Settings...',
      execute: args => {
        if (settingsMain == null) {
          const model = new Model();
          model.advancedRequested.connect(() =>
            commands.execute('settingeditor:open')
          );
          model.manager = manager;
          const content = new MarkdownItSettings(model);
          settingsMain = new MainAreaWidget({ content });
          settingsMain.title.label = 'JupyterLab MarkdownIt';
          settingsMain.title.icon = kMarkupIcon;
          settingsMain.disposed.connect(() => (settingsMain = null));
        }
        shell.add(settingsMain, 'main');
        shell.activateById(settingsMain.id);
      }
    });

    // cached enabled setting
    let enabled = true;

    manager.settingsChanged.connect(() => {
      const { composite } = manager.settings;
      if (composite != null) {
        enabled = !!composite.enabled;
      }
    });

    commands.addCommand(CommandID.toggleRenderer, {
      label: args => 'Use JupyterLab MarkdownIt',
      caption: 'Reopen documents to see changes',
      isToggled: () => enabled,
      isEnabled: () => manager.settings != null,
      execute: args => {
        manager.enabled = !!(args?.enabled == null ? !enabled : args.enabled);
      }
    });

    palette.addItem({
      command: CommandID.showSettings,
      category: kCommandCategory
    });

    palette.addItem({
      command: CommandID.toggleRenderer,
      category: kCommandCategory
    });

    if (menu) {
      menu.settingsMenu.addGroup(
        [
          { command: CommandID.toggleRenderer },
          { command: CommandID.showSettings }
        ],
        100
      );
    }

    return manager;
  }
};

export default [core, ...plugins];