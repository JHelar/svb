import signAddon, { ISignAddonArguments } from '../../src/api/sign-addon';
import request from 'request';
import { IRequestAPIMock } from '../../__mocks__/request';
import { resolve } from 'path';
import { stringify } from "query-string";
import { folder } from '../../src/utils/structure';
import fs from 'fs-extra'
import paths from '../../src/commands/webapp/utils/paths';

describe('API Deploy addon', () => {
	const mockRequest = (request as unknown) as IRequestAPIMock;
	const options: ISignAddonArguments = {
		baseDirectoryPath: resolve(__dirname, './test/testApp'),
		appId: 'test',
		sitevisionPassword: 'test',
		sitevisionUsername: 'tester',
	};
	const path = paths(options.baseDirectoryPath);

	beforeAll(() => {
		fs.mkdirpSync(options.baseDirectoryPath + '/src');
	})

	afterAll(() => {
		fs.removeSync(options.baseDirectoryPath)
	})

	beforeEach(() => {
		mockRequest.clear();
	})

	it('Successfull sign, returns stream', async () => {
		const zipBuffer = await folder.toZipBuffer(path.folders.src);
		const success = await signAddon(options, mockRequest)

		expect(success).toBeTruthy()

		mockRequest.finishRequest();
		expect(mockRequest.post.mock.calls.length).toBe(1);
		
		// Assure that the function sets correct params
		const [ requestOptions, cb ] = mockRequest.post.mock.calls[0];
		const { url, formData, ...rest } = requestOptions;
	
		expect(url).toEqual(`https://developer.sitevision.se/rest-api/appsigner/signapp?${stringify({ certificateName: options.certificateName })}`)
		expect(formData.file.value.length).toBe(zipBuffer.length)
		expect(rest).toMatchObject({
			auth: {
				password: options.sitevisionPassword,
				username: options.sitevisionUsername
			},
			headers: {
				"Content-Type": "multipart/form-data"
			}
		})
	})

	it('Failed request', () => {
		mockRequest.__setMockError(new Error("This should happen"));
		const request = signAddon(options, mockRequest)
			.then(success => {
				expect(success).toBeUndefined();
			})
			.catch(error => {
				expect(error).toBeDefined();
				expect(error.message).toEqual('This should happen')
			})
		mockRequest.finishRequest();
		return request;
	})
})