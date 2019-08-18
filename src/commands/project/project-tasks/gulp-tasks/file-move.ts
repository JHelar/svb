import gulp from 'gulp';
import plumber from 'gulp-plumber';
import { ITaskCreator, ITask } from '..';

const task: ITaskCreator = (paths, destination, base, options) => {
	const moveTask = (filePath: string | string[]) => {
		return gulp.src(filePath, { base })
			.pipe(plumber({
				errorHandler: options.onError
			}))
			.pipe(gulp.dest(destination));
	};

	const watch = () => {
		const watcher = gulp.watch(paths);
		watcher.on('change', moveTask);
		watcher.on('add', moveTask);
		watcher.on('error', options.onError)
	};

	const run = () => new Promise((res, rej) => {
		const gulpStream = moveTask(paths);
		gulpStream.on('error', rej);
		gulpStream.on('done', res);
	});

	return {
		run,
		watch
	} as ITask;
};

export default task;