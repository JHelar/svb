import { ICommandHash } from '../utils/cli-parser';

import webapp from './webapp';
import restapp from './restapp';
import project from './project';

export interface CommandExecuterResult {
	success: boolean,
	message?: string
}
export type CommandExecuter = (cmd: ICommandHash) => Promise<CommandExecuterResult>;
export type CommandTasks = 'create' | 'watch' | 'deploy';

export interface ICommand {
	name: string,
	create?: CommandExecuter,
	watch?: CommandExecuter,
	deploy?: CommandExecuter
}

export type ICommandMap = {
	[key: string]: ICommand
}

const commands: ICommandMap = {}

const registerCommand = (command: ICommand) => {
	commands[command.name] = command;
}

[
	webapp,
	restapp,
	project
].forEach(registerCommand);


export default commands;