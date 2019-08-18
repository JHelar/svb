import { escape } from "querystring";
import request from 'request';
import createAddon, { ICreateAddonArguments } from '../../src/api/create-addon';
import { IRequestAPIMock } from '../../__mocks__/request';

describe('API Create addon', () => {
	const requestMock = (request as unknown) as IRequestAPIMock;
	const options: ICreateAddonArguments = {
		addonName: 'test',
		category: 'Other',
		domain: 'https://test.com',
		password: 'test',
		siteName: 'test',
		username: 'tester'
	};

	beforeEach(() => {
		requestMock.clear();
	});

	it("Successfull request", () => {
		const request = createAddon(options, requestMock)
					.then(success => {
						expect(success).toBeTruthy();
						// Check params going out to SV
						expect(requestMock.post.mock.calls.length).toBe(1);

						// Assure that the function sets correct params
						const [ requestOptions, cb ] = requestMock.post.mock.calls[0];
						const { url, form, auth } = requestOptions;

						expect(url).toEqual(`${options.domain}/rest-api/1/0/${escape(options.siteName)}/Addon Repository/custommodule`);
						expect(form).toMatchObject({ name: options.addonName, category: options.category });
						expect(auth).toMatchObject({ password: options.password, username: options.username });
					})
					.catch(error => {
						expect(error).toBeUndefined();
					});
		requestMock.finishRequest();
		return request;
	});

	it("Failed request", () => {
		requestMock.__setMockError(new Error("This should happen"));
		const request = createAddon(options, requestMock)
			.then(success => {
				expect(success).toBeUndefined();
			})
			.catch(error => {
				expect(error).toBeDefined();
				expect(error.message).toEqual("This should happen");
			});
		requestMock.finishRequest();

		return request;
	});
});