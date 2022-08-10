# divemarkdownit

A JupyterLab extension to include [markdown-it](https://github.com/markdown-it/markdown-it) and its extensions for markdown rendering.

Currently supported markdown-it extensions include:

- [markdown-it-docutils](https://github.com/executablebooks/markdown-it-docutils)
- [markdown-it-diagrams](https://github.com/valeriangalliat/markdown-it-anchor)
- [markdown-it-task-checkbox](https://github.com/linsir/markdown-it-task-checkbox)
- [markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)

- [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor)

## Requirements

* JupyterLab >= 3.0

## Install

To install the extension, execute:

```shell
pip install divemarkdownit
```


## Contributing

### Development install

Note: You will need NodeJS to build the extension package.

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```shell
# Clone the repo to your local environment
git clone https://github.com/dive4dec/divemarkdownit.git
# Change directory to the divemarkdownit directory
cd divemarkdownit
# Install package in development mode
pip install -e .
# Link your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite
# Rebuild extension Typescript source after making changes
jlpm run build
```

You can watch the source directory and run JupyterLab at the same time in different terminals to watch for changes in the extension's source and automatically rebuild the extension.

```shell
# Watch the source directory in one terminal, automatically rebuilding when needed
jlpm run watch
# Run JupyterLab in another terminal
jupyter lab
```

With the watch command running, every saved change will immediately be built locally and available in your running JupyterLab. Refresh JupyterLab to load the change in your browser (you may need to wait several seconds for the extension to be rebuilt).

By default, the `jlpm run build` command generates the source maps for this extension to make it easier to debug using the browser dev tools. To also generate source maps for the JupyterLab core extensions, you can run the following command:

```shell
jupyter lab build --minimize=False
```

### Development uninstall

```shell
pip uninstall jupyterlab_markdownit
```

When uninstalling you will also need to remove the symlink created by `jupyter labextension develop . --overwrite`
command. To find its location, you can run `jupyter labextension list` to figure out where the `labextensions`
folder is located. Then you can remove the symlink named `divemarkdownit` in that folder.

### Packaging the extension

See [RELEASE](RELEASE.md)


## Acknowledgement 

Credit must be given to [@agoose77/jupyterlab-markup](https://github.com/agoose77/jupyterlab-markup). Actually this repo is more of a replica of `jupyterlab-markup`, rearranged with my own flavor.