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
		globs: {
			velocity: [baseResolver('src/sv-modules/**/*.vm')],
			svModules: [baseResolver('src/sv-modules/**/*.js')],
			scss: [baseResolver('src/styles/**/*.scss'), `!${baseResolver('src/styles/**/_*.scss')}`],
			resources: [baseResolver('src/resources/**/*')],
			client: [baseResolver('src/client/**/*.js')],
			sync: [baseResolver('dist/**/*.*')]
		},
		folders: {
			src: baseResolver('src'),
			dist: baseResolver('dist'),
			client: baseResolver('src/client'),
			resources: baseResolver('src/resources'),
			styles: baseResolver('src/styles'),
			svModules: baseResolver('src/sv-modules'),
			node_modules: baseResolver('src/node_modules')
		},
		files: {
			settings: baseResolver('.dev-settings.json'),
			prodSettings: baseResolver('.prod-settings.json'),
			ignore: baseResolver('.gitignore'),
			webpackConfig: baseResolver('webpack.config.js')
		},
	};
};