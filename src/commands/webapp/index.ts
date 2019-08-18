import { ICommand } from "..";

import create from './webapp-create';
import deploy from './webapp-deploy';

const command: ICommand = {
	name: 'webapp',
	create,
	deploy
}

export default command;