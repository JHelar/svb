import yargs, { Arguments } from 'yargs';
import path from 'path';
import { CommandTasks } from '../commands';

export interface ICommandTaskName {
	name: string;
	task: CommandTasks;
}

export interface ICommandHash {
	command: ICommandTaskName;
	directoryPath: string;
}

export default () => {
	const myCommands = yargs
		.usage('Usage: svhiq <task> <type> [options]')
		.demandCommand(2)
		.option('force', {
			alias: 'f',
			description: 'Force deploy of a webapp',
		})
		.option('vue', {
			description: 'Create webapp with vue template'
		})
		.option('production', {
			alias: 'p',
			description: 'Deploy to production'
		})
		// .command('create webapp', 'Create a webapp')
		// .command('create project', 'Create a new project')
		// .command('deploy webapp', 'Deploy a webapp')
		.example('svhiq create webapp my-webapp', 'Create a new webapp called my-webapp in current directory')
		.example('svhiq deploy webapp', 'Deploy the webapp in current directory')
		.help('h', 'help')
		.epilog('Copyright 2019')
		.exitProcess(false);

	const {
		_,
		$0,
		...rest
	} = myCommands.parse(process.argv.slice(2));

	const [ task, name, fileName ] = _;

	if (task && name) {
		const directoryPath = path.resolve(process.cwd(), fileName || '.');

		return {
			command: {
				name,
				task,
			},
			directoryPath,
			...rest
		} as ICommandHash;
	}
	/* istanbul ignore next */
	throw new Error('Insufficient arguments');
};