import gulp from 'gulp';
import plumber from 'gulp-plumber';
import { ITaskCreator } from '..';

const task: ITaskCreator = (paths, destination, base, options) => {
	const resolver = (filePath: string[] | string) => {
		return gulp.src(filePath, { base })
			.pipe(plumber({
				errorHandler: options.onError
			}))
			.pipe(require('gulp-hiq-module-resolver')())
			.pipe(gulp.dest(destination));
	};

	const watch = () => {
		const watcher = gulp.watch(paths);
		watcher.on('change', resolver);
		watcher.on('error', options.onError);
	};

	const run = () => new Promise((res, rej) => {
		const gulpStream = resolver(paths);
		gulpStream.on('error', rej);
		gulpStream.on('done', res);
	});

	return {
		watch,
		run
	};
};

export default task;