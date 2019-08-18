import { resolve } from "path";
import isWindows from 'is-windows';

export default (baseDirectoryPath: string) => {
	const baseResolver = (path: string) => {
		const appendedPath = resolve(baseDirectoryPath, path);
		if (isWindows) {
			return appendedPath.replace(/\\/g, '/');
		}
		return appendedPath;
	};

	return {
		folders: {
			src: baseResolver('src'),
			component: baseResolver('src/component'),
			config: baseResolver('src/config'),
			css: baseResolver('src/css'),
			resource: baseResolver('src/resource'),
			i18n: baseResolver('src/i18n'),
			template: baseResolver('src/template'),
			partials: baseResolver('src/template/partials'),

		},
		vue: {
			vue: baseResolver('vue'),
			root: baseResolver('vue/display'),
			src: baseResolver('vue/display/src'),
			resource: baseResolver('src/resource/vue'),
			dist: {
				js: baseResolver('vue/display/dist/js'),
				css: baseResolver('vue/display/dist/css')
			}
		},
		files: {
			index: baseResolver('src/index.js'),
			main: baseResolver('src/main.js'),
			mainHTML: baseResolver('src/template/main.html'),
			manifest: baseResolver('src/manifest.json'),
			settings: baseResolver('.dev-settings.json'),
			prodSettings: baseResolver('.prod-settings.json'),
			language: {
				sv: baseResolver('src/i18n/sv.json'),
				en: baseResolver('src/i18n/en.json'),
			},
			ignore: baseResolver('.gitignore'),
		},
	};
};