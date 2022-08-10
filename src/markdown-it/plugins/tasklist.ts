import { simpleMarkdownItPlugin } from '../utils';
import { kPackageName } from '../values';

/**
 * Provides tasklist
 */
export const task = simpleMarkdownItPlugin(kPackageName, {
  id: 'markdown-it-task-checkbox',
  title: 'Tasklists',
  description: 'Create GitHub-style tasklists',
  documentationUrls: {
    Plugin: 'https://github.com/linsir/markdown-it-task-checkbox'
  },
  examples: {
    'Tasklist': `
- [ ] Mercury
- [x] Venus
- [x] Earth (Orbit/Moon)
- [x] Mars
- [ ] Jupiter
- [ ] Saturn
- [ ] Uranus
- [ ] Neptune
- [ ] Comet Haley
`
  },
  plugin: async () => {
    const taskPlugin = await import(
      /* webpackChunkName: "markdown-it-task-checkbox" */ 'markdown-it-task-checkbox'
    );
    return [taskPlugin.default];
  }
});
