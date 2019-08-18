import makeSettings, { IWebAppSettingsOptions } from '../../../../src/commands/webapp/utils/settings';
import { ICommandHash } from '../../../../src/utils/cli-parser';
import { resolve } from 'path';
import { writeFileSync, removeSync, mkdirpSync } from 'fs-extra';
import paths from '../../../../src/commands/webapp/utils/paths';

describe('Webapp settings', () => {
	const cmd: ICommandHash = {
		command: {
			name: 'create',
			task: 'watch'
		},
		directoryPath: resolve(process.cwd(), './test/settings-test')
	};
	const path = paths(cmd.directoryPath);

	const settingsOptions: IWebAppSettingsOptions = {
		properties: {
			addonName: 'myWebApp',
			domain: 'test.com',
			password: 'test',
			siteName: 'test',
			username: 'test',
			category: 'Other',
			created: false
		},
		sign: {
			name: 'cert',
			password: 'test',
			username: 'test'
		},
		production: false
	};

	beforeAll(() => {
		mkdirpSync(path.folders.src);
	});

	afterAll(() => {
		removeSync(cmd.directoryPath);
	});

	it('Cannot create properties if there is no manifest.json file present', done => {
		const mockCallback = jest.fn(() => {});
		const mockCatch = jest.fn((error: Error) => {
			return error.message;
		});

		makeSettings(cmd, {
			...settingsOptions,
			properties: undefined
		})
		.then(settings => settings.properties)
		.then(mockCallback)
		.catch(mockCatch)
		.then(() => {
			expect(mockCallback.mock.calls.length).toBe(0);
			expect(mockCatch.mock.calls.length).toBe(1);
			expect(mockCatch.mock.results[0].value).toBe('No webapp manifest.json file found!');
			done();
		});
	});

	it('Reads the .app-settings.json correct and returns settings object', () => {
		// Write the settings file
		writeFileSync(path.files.settings, JSON.stringify(settingsOptions));

		const settings = makeSettings(cmd)
			.then(({ sign, properties }) => {
				expect(sign).toMatchObject(settingsOptions.sign);
				expect(properties).toMatchObject(settingsOptions.properties);
			})
			.catch(error => {
				expect(error).toBeUndefined();
			})
			.finally(() => {
				removeSync('./test/.dev-settings.json');
			});
		return settings;
	});
});