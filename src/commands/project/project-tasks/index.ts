import moveTask from './file-move';
import nodeResolverTask from './module-resolver';
import webpackTask from './webpack';
import scssTask from './scss-compile';
import webavTask from './webdav-sync';

export interface ITask {
	run(): Promise<any>;
	watch(): void;
}

export interface ITaskOptions {
	onError(err?: any): void;
	onSuccess?(msg: string): void;
	onStatus?(msg: string): void;
}

export interface ITaskCreator<TOptions extends ITaskOptions = ITaskOptions> {
	(paths: string[], destination: string, base: string, taskOptions: TOptions): ITask;
}

export default {
	move: moveTask,
	nodeResolver: nodeResolverTask,
	webpack: webpackTask,
	scss: scssTask,
	webdav: webavTask
};