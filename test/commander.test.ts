import commander from '../src/commander';
import { ICommandHash } from '../src/utils/cli-parser';

describe('Commander', () => {
	it('Invalid command', done => {
		const cmd: ICommandHash = {
			command: {
				name: 'fail',
				task: 'create'
			},
			directoryPath: process.cwd()
		};
		let error: Error;

		try {
			commander(cmd.command);
		} catch (e) {
			error = e;
		}

		expect(error).toBeDefined();
		expect(error.message).toEqual('Unknown command: "fail"');

		done();
	});

	it('Invalid task', done => {
		const cmd: any = {
			command: {
				name: 'webapp',
				task: 'fail'
			},
			directoryPath: process.cwd()
		};

		let error: Error;

		try {
			commander(cmd.command);
		} catch (e) {
			error = e;
		}

		expect(error).toBeDefined();
		expect(error.message).toEqual('Unknown task: "fail"');

		done();
	});

	it('succeeds: create webapp mySuccess', done => {
		const cmd: ICommandHash = {
			command: {
				name: 'webapp',
				task: 'create'
			},
			directoryPath: process.cwd()
		};

		expect(commander(cmd.command)).toBeDefined();

		done();
	});

	it('succeeds: deploy webapp mySuccess', done => {
		const successCommand = 'webapp-deploy mySuccess';
		const cmd: ICommandHash = {
			command: {
				name: 'webapp',
				task: 'deploy'
			},
			directoryPath: process.cwd()
		};
		expect(commander(cmd.command)).toBeDefined();

		done();
	});
});