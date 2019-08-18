import Listr from 'listr';
import tasks from './project-tasks';
import { ICommandHash } from '../../utils/cli-parser';
import { CommandExecuterResult } from '..';
import makeConsole from '../../utils/console';
import makePaths from './utils/paths';
import makeSettings from './utils/settings';

const console = makeConsole('PROJECT-WATCH');


const onError = (err: any) => {
	// const error = {
	// 	...err
	// }
	console.error(JSON.stringify(err));
};

export interface IWatchProjectTask extends ICommandHash {
	production: boolean;
}

export default async (
	cmd: IWatchProjectTask
): Promise<CommandExecuterResult> => {
	if (cmd.production) {
		process.env.NODE_ENV = 'production';
	} else {
		process.env.NODE_ENV = 'development';
	}
	const paths = makePaths(cmd.directoryPath);
	const settings = await makeSettings(cmd, { production: cmd.production });
	let webdavUrl = settings.domain;
	if (!webdavUrl.endsWith('webdav')) {
		webdavUrl = webdavUrl.replace(/\/$/, '') + '/webdav';
	}

	const list = new Listr([
		{
			title: 'Starting velocity compiler',
			task: () =>
				tasks
					.move(
						paths.globs.velocity,
						paths.folders.dist,
						paths.folders.src,
						{
							onError
						}
					)
					.watch()
		},
		{
			title: 'Starting resource mover',
			task: () =>
				tasks
					.move(
						paths.globs.resources,
						paths.folders.dist,
						paths.folders.src,
						{
							onError
						}
					)
					.watch()
		},
		{
			title: 'Starting sv module resolver',
			task: () =>
				tasks
					.nodeResolver(
						paths.globs.svModules,
						paths.folders.dist,
						paths.folders.src,
						{ onError }
					)
					.watch()
		},
		{
			title: 'Starting scss compiler',
			task: () =>
				tasks
					.scss(
						paths.globs.scss,
						paths.folders.dist,
						paths.folders.src,
						{
							onError,
							node_modules_path: paths.folders.node_modules
						}
					)
					.watch()
		},
		{
			title: 'Starting webpack watcher',
			task: () =>
				tasks
					.webpack(
						paths.globs.client,
						paths.folders.dist,
						paths.folders.src,
						{
							onError,
							projectPath: cmd.directoryPath
						}
					)
					.watch()
		},
		{
			title: 'Starting remote sync',
			task: () =>
				tasks
					.webdav(paths.globs.sync, '', '', {
						onError,
						onSuccess: console.success,
						onStatus: msg => console.info(msg.replace('...', '')),
						webdav: {
							baseurl: webdavUrl,
							password: settings.password,
							username: settings.username
						},
						remote_base: settings.remote_base,
						local_base: 'dist'
					})
					.watch()
		}
	]);
	return list
		.run()
		.then(() => ({
			message: 'Successfully started watchers',
			success: true
		}))
		.catch(err => ({
			success: false,
			message: err.message
		}));
};
