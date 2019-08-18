import { ICommandTaskName } from './utils/cli-parser';

import commands, { CommandExecuter } from './commands';

const getExecuter = (cmd: ICommandTaskName): CommandExecuter => {
	if (cmd.name in commands) {
		const command = commands[cmd.name];

		switch (cmd.task) {
			case 'create':
				return command.create;
			case 'watch':
				return command.watch;
			case 'deploy':
				return command.deploy;
			default:
				throw new Error(`Unknown task: "${cmd.task}"`);
		}
	}
	throw new Error(`Unknown command: "${cmd.name}"`);
};

export default (command: ICommandTaskName) => {
	const exec = getExecuter(command);

	if (exec) {
		return exec;
	}
};