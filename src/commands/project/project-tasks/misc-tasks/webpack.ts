import { ITaskCreator, ITask, ITaskOptions } from '..';
import execa from 'execa';

interface IWebappTaskArgs extends ITaskOptions {
	projectPath: string;
}

const task: ITaskCreator<IWebappTaskArgs> = (paths, destination, base, options) => {

	const watch = () => {
		// Start webpack watch...
		execa('webpack', [ '--config', 'webpack.config.js', '--watch' ], { cwd: options.projectPath, stdout: process.stdout, stderr: process.stderr });
	};

	const run = () => new Promise((res, rej) => {
		execa('webpack', [ '--config', 'webpack.config.js' ], { cwd: options.projectPath, stdout: process.stdout, stderr: process.stderr })
			.then(res)
			.catch(rej);
	});

	return {
		run,
		watch
	} as ITask;
};

export default task;