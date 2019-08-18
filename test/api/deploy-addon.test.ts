import deployAddon, { IDeployAddonArguments } from '../../src/api/deploy-addon';
import request from 'request';
import { IRequestAPIMock } from '../../__mocks__/request';
import { resolve } from 'path';
import { escape } from 'querystring';
import { stringify } from 'query-string';
import { folder } from '../../src/utils/structure';
import fs from 'fs-extra';
import paths from '../../src/commands/webapp/utils/paths';

describe('API Deploy addon', () => {
	const mockRequest = (request as unknown) as IRequestAPIMock;
	const options: IDeployAddonArguments = {
		zipFile: resolve(process.cwd(), './test/api-deploy-test'),
		addonName: 'test',
		domain: 'https://test.com',
		force: true,
		password: 'test',
		siteName: 'test',
		username: 'test'
	};
	const path = paths(options.zipFile as string);

	beforeAll(() => {
		fs.mkdirpSync((options.zipFile as string) + '/src');
	});

	afterAll(() => {
		fs.removeSync(options.zipFile as string);
	});

	beforeEach(() => {
		mockRequest.clear();
	});

	it('Successfull deploy without stream', async () => {
		const zipBuffer = await folder.toZipBuffer(path.folders.src);
		const success = await deployAddon(options, mockRequest)
		expect(success).toBeTruthy();
		expect(mockRequest.post.mock.calls.length).toBe(1);

		// Assure that the function sets correct params
		const [requestOptions, cb] = mockRequest.post.mock.calls[0];
		const { url, formData, ...rest } = requestOptions;

		expect(url).toEqual(
			`${options.domain}/rest-api/1/0/${escape(
				options.siteName
			)}/Addon Repository/${escape(
				options.addonName
			)}/webAppImport?${stringify({ force: options.force })}`
		);
		expect(formData.file.value.length).toBe(zipBuffer.length);
		expect(rest).toMatchObject({
			auth: {
				password: options.password,
				username: options.username
			},
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	});

	it('Successfull deploy with stream', async () => {
		const zipBuffer = await folder.toZipBuffer(path.folders.src);
		options.zipFile = zipBuffer;

		const success = await deployAddon(options, mockRequest)
		expect(success).toBeTruthy();
		expect(mockRequest.post.mock.calls.length).toBe(1);

		// Assure that the function sets correct params
		const [requestOptions, cb] = mockRequest.post.mock.calls[0];
		const { url, formData, ...rest } = requestOptions;

		expect(url).toEqual(
			`${options.domain}/rest-api/1/0/${escape(
				options.siteName
			)}/Addon Repository/${escape(
				options.addonName
			)}/webAppImport?${stringify({ force: options.force })}`
		);
		expect(formData.file.value.length).toBe(zipBuffer.length);
		expect(rest).toMatchObject({
			auth: {
				password: options.password,
				username: options.username
			},
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	});

	it('Failed request', () => {
		mockRequest.__setMockError(new Error('This should happen'));
		const request = deployAddon(options, mockRequest)
			.then(success => {
				expect(success).toBeUndefined();
			})
			.catch(error => {
				expect(error).toBeDefined();
				expect(error.message).toEqual('This should happen');
			});
		mockRequest.finishRequest();
		return request;
	});
});
