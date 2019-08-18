import { ICommand } from "..";

import create from './restapp-create';
import deploy from './restapp-deploy';

const command: ICommand = {
	name: 'restapp',
	create,
	deploy
}

export default command;