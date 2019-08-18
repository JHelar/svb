import request, { RequestAPI, Request, Options, RequiredUriUrl, RequestCallback } from 'request';

export interface IRequestAPIMock extends RequestAPI<Request, Options, RequiredUriUrl>  {
	delayTimer: NodeJS.Timeout,
	get: jest.Mock<Request, any>,
	post: jest.Mock<Request, any>,
	put: jest.Mock<Request, any>,
	delete: jest.Mock<Request, any>,
	__setMockError: (mE: Error) => void,
	__setMockResponse: (mR: RequestCallback) => void,
	__setDelay: (mD: number) => void,
	finishRequest: () => void,
	clear: () => void
}
let mockResponse = {
	statusCode: 200,
	statusMessage: 'Ok'
}
let mockDelay = 1;
let mockError: Error;

const requestMock = jest.genMockFromModule<IRequestAPIMock>('request');
const req = (options: Options & RequiredUriUrl, callback: RequestCallback) => {
	if(mockError) {
		callback(mockError, { statusCode: 400, statusMessage: 'Bad request' } as any, {})
	} else {
		callback(null, mockResponse as any, {});
	}
	return {} as Request
}

requestMock.get.mockImplementation(req);
requestMock.post.mockImplementation(req);
requestMock.put.mockImplementation(req);
requestMock.delete.mockImplementation(req);

requestMock.__setMockError = (mE) => mockError = mE;
requestMock.__setDelay = (mD) => mockDelay = mD;
requestMock.finishRequest = () => jest.runOnlyPendingTimers();
requestMock.clear = () => {
	mockError = undefined;
	requestMock.get.mockClear();
	requestMock.post.mockClear();
	requestMock.put.mockClear();
	requestMock.delete.mockClear();
}

export default requestMock;