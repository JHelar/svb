import request, { Options, RequiredUriUrl, Response, RequestCallback } from 'request';
import { RequesterAPI } from '../api';

const tryParseJson = (jsonString: any) => {
	try {
		const json = JSON.parse(jsonString);
		return json;
	} catch (e) {
		return undefined;
	}
};

const makeRequestError = (error: any, httpResponse: Response) => {
	const statusCode = httpResponse.statusCode || 500;
	const statusMessage = httpResponse.statusMessage || 'Ooops something went really wrong!';

	if (error instanceof Error) {
		return {
			message: error.message,
			statusCode
		};
	} else if (typeof error === 'string') {
		return {
			message: error,
			statusCode
		};
	} else {
		return {
			...error,
			message: statusMessage,
			statusCode
		};
	}
};

const makeRequestCallback: <TReturn>(res: (value?: TReturn) => void, rej: (reason?: any) => void) => RequestCallback = (res, rej) =>
(error, httpResponse, body) => {
	if (error) {
		rej(makeRequestError(error, httpResponse));
	} else if (httpResponse.statusCode === 200) {
		// Try parse else return body
		const json = tryParseJson(body);
		res(json || body);
	} else {
		// Other type of status error from server try parse JSON else rej body as is.
		const json = tryParseJson(body);
		if (json) {
			rej(makeRequestError(body, httpResponse));
		} else {
			rej(makeRequestError({}, httpResponse));
		}
	}
};


export const post = <TReturn = any>(args: Options & RequiredUriUrl, requester = request): Promise<TReturn> => {
	return new Promise((res, rej) => {
		requester.post(args, makeRequestCallback(res, rej));
	});
};