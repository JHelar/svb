import { resolve } from "path";
import { pathExistsSync, existsSync } from "fs-extra";
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
		project: {
			get devSettings(): string {
				// Try and find the project settings path.
				let iterations = 0;
				let settingsPath = resolve(baseDirectoryPath, '..');
				const maxIterations = 10;
				while (!existsSync(settingsPath + '/.dev-settings.json')) {
					settingsPath = resolve(settingsPath, '..');
					iterations++;
					if (iterations > maxIterations) return undefined;
				}
				return settingsPath;
			},
			get prodSettings(): string {
				// Try and find the project settings path.
				let iterations = 0;
				let settingsPath = resolve(baseDirectoryPath, '..');
				const maxIterations = 10;
				while (!existsSync(settingsPath + '/.prod-settings.json')) {
					settingsPath = resolve(settingsPath, '..');
					iterations++;
					if (iterations > maxIterations) return undefined;
				}
				return settingsPath;
			},
		},
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
			root: baseResolver('vue/display'),
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