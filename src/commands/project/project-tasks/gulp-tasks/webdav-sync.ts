import gulp from 'gulp';
import plumber from 'gulp-plumber';
import path from 'path';
import fs from 'fs-extra';

import { ITaskCreator, ITaskOptions } from '..';

interface IWebdavSyncTaskOptions extends ITaskOptions {
	webdav: {
		baseurl: string;
		username: string;
		password: string;
	};
	local_base: string;
	remote_base: string;
}

const files: { [key: string]: () => boolean } = {};

const task: ITaskCreator<IWebdavSyncTaskOptions> = (
	paths,
	destination,
	base,
	options
) => {
	const webdav = require('gulp-hiq-webdav');
	const handler = () =>
		webdav({
			webdav: options.webdav,
			remote_base: options.remote_base,
			local_base: options.local_base,
			misc: {
				errorCallback: options.onError,
				successCallback: options.onSuccess,
				statusCallback: options.onStatus
			}
		});

	const webdavSync = (filePath: string[] | string, done?: () => void) => {
		if (!done) {
			done = () => {};
		}
		return gulp
			.src(filePath, { base })
			.pipe(
				plumber({
					errorHandler: options.onError
				})
			)
			.pipe(handler().push)
			.on('data', done);
	};

	const handleFile = (filePath: string) => {
		if ((filePath in files && files[filePath]()) || fs.statSync(filePath).isDirectory()) {
			return;
		}
		let isHandling = true;
		let spamCount = 0;
		files[filePath] = () => {
			if (spamCount > 0) {
				if (spamCount < 4) {
					if (options.onStatus) options.onStatus(`Syncing "${path.basename(filePath)}" in progress`);
				} else if (spamCount >= 4 && spamCount < 8) {
					if (options.onStatus) options.onStatus('Stressed much?');
				} else {
					if (options.onStatus) options.onStatus('STOP SPAMMING!');
				}
			}
			spamCount++;
			return isHandling;
		};
		webdavSync(filePath, () => {
			isHandling = false;
		});
	};

	const watch = () => {
		const watcher = gulp.watch(paths);
		watcher.on('change', handleFile);
		watcher.on('add', handleFile);
		watcher.on('error', options.onError);
	};

	const run = () =>
		new Promise((res, rej) => {
			const gulpStream = webdavSync(paths);
			gulpStream.on('error', rej);
			gulpStream.on('done', res);
		});

	return {
		watch,
		run
	};
};

export default task;
