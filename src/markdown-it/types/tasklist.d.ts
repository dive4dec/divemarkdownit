declare module 'markdown-it-task-checkbox' {
  import MarkdownIt = require('markdown-it');

  namespace markdownItTasklist {
    function tasklist_plugin(md: MarkdownIt): void;
  }

  const MarkdownItTasklist: typeof markdownItTasklist.tasklist_plugin;
  export = MarkdownItTasklist;
}  