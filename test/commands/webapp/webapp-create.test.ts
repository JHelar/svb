import create, {
	ICreateOptions, ICreateWebappTask
} from '../../../src/commands/webapp/webapp-create';
import { ICommandHash } from '../../../src/utils/cli-parser';

import fs from 'fs-extra';
import { resolve } from 'path';

describe('Webapp create', () => {
	const mockCallback = jest.fn(() => {});
	const mockCatch = jest.fn((error: Error) => {
		console.log(error.message);
	});
	const expectManifest = {
		id: 'my-cool-webapp',
		version: '0.0.1',
		name: 'myCoolWebapp',
		author: 'Tester',
		description: 'A test webapp',
		helpUrl: 'https://hiq.se',
		type: 'WebApp'
	};
	const options: ICreateOptions = {
		author: 'Tester',
		description: 'A test webapp',
		helpUrl: 'https://hiq.se',
		id: 'my-cool-webapp',
		name: 'myCoolWebapp'
	};

	it('Create a correct webapp structure', done => {
		const cmd: ICreateWebappTask = {
			command: {
				name: 'webapp',
				task: 'create'
			},
			directoryPath: resolve(process.cwd(), './test/myCoolWebapp'),
			vue: false
		};

		create(cmd, options)
			.then(mockCallback)
			.catch(mockCatch)
			.then(() => {
				expect(mockCallback.mock.calls.length).toBe(1);
				expect(mockCatch.mock.calls.length).toBe(0);

				const data = fs.readFileSync(
					'./test/myCoolWebapp/src/manifest.json'
				);
				expect(data).toBeDefined();

				const manifestObject = JSON.parse(data.toString());
				expect(manifestObject).toMatchObject(expectManifest);
			})
			.then(() => {
				fs.remove('./test/myCoolWebapp');
			}, () => {
				fs.remove('./test/myCoolWebapp');
			})
			.then(() => {
				done();
			});
	});
});
