import gulp from 'gulp';
import plumber from 'gulp-plumber';
import { ITaskCreator, ITaskOptions } from '..';
import resolve from 'resolve';
import path from 'path';

interface IScssCompileTaskOptions extends ITaskOptions {
	node_modules_path: string;
}

const partialResolver = (id: string, basedir: string, importOptions: any) => new Promise((res, rej) => {
	const resolveOptions = { extensions: ['.scss'], basedir, moduleDirectory: 'node_modules' };
	resolve(id, resolveOptions, (err, filePath) => {
		if (err) {
			// Try with '_'
			const basename = path.basename(id);
			try {
				res(resolve.sync(`${id.replace(basename, `_${basename}`)}`, resolveOptions));
			} catch (e) {
				rej(e);
			}
		} else {
			res(filePath);
		}
	});
});

const task: ITaskCreator<IScssCompileTaskOptions> = (paths, destination, base, options) => {
	const scss = require('gulp-sass');
	const autoprefixer = require('gulp-autoprefixer');
	const cleanCSS = require('gulp-clean-css');
	const rename = require('gulp-rename');
	const sassGlob = require('gulp-sass-glob');

	const scssCompile = (filePath: string[] | string) => {
		return gulp
			.src(filePath, { base })
			.pipe(plumber({
				errorHandler: options.onError
			}))
			.pipe(sassGlob())
			.pipe(scss({outputStyle: 'compressed'}))
			.pipe(autoprefixer())
			.pipe(cleanCSS())
			.pipe(rename({
				extname: '.css'
			}))
			.pipe(gulp.dest(destination));
	};

	const watch = () => {
		const watcher = gulp.watch(paths);
		watcher.on('change', scssCompile);
		watcher.on('error', options.onError);
	};

	const run = () =>
		new Promise((res, rej) => {
			const gulpStream = scssCompile(paths);
			gulpStream.on('error', rej);
			gulpStream.on('done', res);
		});

	return {
		watch,
		run
	};
};

export default task;
