import { IApi } from "../src/api";

export interface IApiMock extends IApi {
	addon: {
		create: jest.Mock,
		deploy: jest.Mock,
		sign: jest.Mock
	}
}

const mockApi: IApi = {
	addon: {
		create: jest.fn(() => {
			return Promise.resolve(true)
		}),
		deploy: jest.fn(() => {
			return Promise.resolve(true)
		}),
		sign: jest.fn(() => {
			return Promise.resolve(Buffer.from("test"))
		})
	}
}

export default mockApi;