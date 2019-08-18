import cli from '../../src/utils/cli-parser';
import { resolve } from 'path';

const virtualCwd = process.cwd();
console.error = () => {};

describe('Command line', () => {
	it('Successfull command', () => {
		process.argv = 'filepath svhiq create webapp .'.split(' ');
		const cmd = cli();
		expect(cmd).toMatchObject({ command: { name: 'webapp', task: 'create' }, directoryPath: virtualCwd});
	});

	it('Failed command', () => {
		process.argv = 'filepath svhiq'.split(' ');
		expect(cli()).toThrowError();
	});
});