import create from './project-create';
import watch from './project-watch';
import { ICommand } from '..';

const command: ICommand = {
	name: 'project',
	create,
	watch
}

export default command;