# Sitevision boilerplate CLI
A cli interface to create, develop and maintain sitevision projects, webapps and restapps.

## Description

This CLI was made in order to make SiteVision development easier and more fun.

Creation of webapps and restapps with deployment and automatic signing to choosen SiteVision environment. Also includes an option to use VUE as front end framework instead of the default sitevision "Component" library.

Creation of a complete project with built in filewatchers for scss, client js, script module files, resource files with automatic sync to a remote SiteVision environment. 

# ToC
1. [Prerequisites](#Prerequisites)
2. [Installing](#Installing)
3. [Commands](#Commands)
	1. [Options](#Options)
4. [Examples](#Examples)
5. [Boilerplates](#Boilerplates)
	1. [Webapp](#Webapp)

## Prerequisites 

It is recommended to install `@vue/cli` before using the `webapp` task.

Install it with:
```bash
$ npm install -g @vue/cli
```

## Installing

This package should be installed globally.

Using npm:

```bash
$ npm install -g sitevision-boilerplate-cli
```

## Commands

Every command needs atleast a `name` and `task`.

Commandshape: 
```bash
$ svb <task> <name> '<optional folderpath>' [options]
```

A `name` is what type you are trying to target:
* `project`
* `webapp`
* `restapp`

A `task` is what action you are trying to do towards the `name`:
* `create` =>  Creates and initializes a given `name`
* `watch` => Watches for file changes and does suitable transformations and actions towards the filetype. Currently this `task` is only available for `project`'s
* `deploy` => Deploys to a remote. This `task` is only available for `webapp` and `restapp`.

### Options

* `-p` or `--production` => Signals if we should face the command towards a production environment.
* `--vue` => Signals if the `webapp` is or should be initialized with a vue client application. NOTE: You have to have `@vue/cli` installed in the global scope.
* `-f` or `--force` => Signals if we should deploy the `webapp` or `restapp` with the "force" argument.
* `-h` => Get a printout of available commands.

## Examples

Create a webapp named "myWebapp" in current directory
```bash
$ svb create webapp myWebapp
```

Create a webapp named "myWebapp" with a VUE client
```bash
$ svb create webapp myWebapp --vue
```

Deploy the webapp to remote.
```bash
$ svb deploy webapp -f
```
In the `package.json` file you can find allready premade script tasks that are more suitable to the current `project`, `webapp` or `restapp`.

## Boilerplates
These are the boilerplates and their structures

### Webapp
Webapps can be created with or without the `--vue` option.
```bash
$ svb create webapp myApp
```

#### With VUE client
If the vue option is added the boilerplate will be instantiated with a VUE client.
This means that the front end development for the app is developed in the `/vue/display` directory. This is a regular VUE project so in order to start development just run:
```bash
$ cd /vue/display
$ npm run serve
```
Deploy the webapp with:
```bash
$ npm run force-deploy-vue
```
or
```bash
$ svb deploy webapp -f --vue
```
When deploying with `--vue` the vue application will be built, .js files will be moved to the app `src/resource` folder and all styles will be moved to `src/css` folder. 
A script will then automaticly update the `script` tag in `src/template/main.html` to point to the newly generated file.

At runtime the Webapp state is automaticly imported to the VUE applicaion.

#### Notes
* It is recommended that you replace the name `APP_NAME` in both `scr/main.js` and `vue/display/src/main.ts` to a proper name. This is to prevent app conflicts if more than one of these types of apps appears on the same page.

* If you did not make any changes to the vue application, you can omit the `--vue` option when you deploy. Or simply run: `npm run force-deploy`. This will not rebuild the vue application and deployment will be quicker.
