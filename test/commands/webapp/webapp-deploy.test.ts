import webappDeploy, { IDeployWebappTask } from '../../../src/commands/webapp/webapp-deploy';
import api, { IApiMock } from '../../../__mocks__/api';
import { ICommandHash } from '../../../src/utils/cli-parser';
import { IWebAppSettingsOptions } from '../../../src/commands/webapp/utils/settings';

import 'jest-extended';
import { mkdirpSync, writeFileSync, removeSync } from 'fs-extra';
import paths from '../../../src/commands/webapp/utils/paths';
import { resolve } from 'path';

describe('Webapp deploy', () => {
	const cmd: ICommandHash = {
		command: {
			name: 'webapp',
			task: 'deploy'
		},
		directoryPath: resolve(process.cwd(), './test/test-deploy')
	};
	const mockApi = (api as unknown) as IApiMock;
	const path = paths(cmd.directoryPath);

	beforeAll(() => {
		// Write a dummy settings file
		const settings: IWebAppSettingsOptions = {
			properties: {
				addonName: 'test',
				category: 'Other',
				created: false,
				domain: 'https://test.com',
				password: 'test',
				siteName: 'test',
				username: 'test'
			},
			sign: {
				name: 'testsign',
				password: 'testsign',
				username: 'testusername'
			}
		};
		mkdirpSync(path.folders.src);
		writeFileSync(path.files.settings, JSON.stringify(settings));
	});

	afterAll(() => {
		removeSync(cmd.directoryPath);
	});

	it('Runs deploy in correct order', () => {
		const request = webappDeploy(cmd as IDeployWebappTask, mockApi)
			.then(success => {
				expect(success).toBeTruthy();

				// Assure all have been called once
				expect(mockApi.addon.create.mock.calls.length).toBe(1);
				expect(mockApi.addon.sign.mock.calls.length).toBe(1);
				expect(mockApi.addon.deploy.mock.calls.length).toBe(1);

				// Assure callorder: Create -> Sign -> Deploy
				expect(mockApi.addon.create).toHaveBeenCalledBefore(mockApi.addon.sign);
				expect(mockApi.addon.sign).toHaveBeenCalledBefore(mockApi.addon.deploy);
			})
			.catch(error => {
				expect(error).toBeUndefined();
			});
		return request;
	});
});