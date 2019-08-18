import createAddon, { ICreateAddonArguments } from './create-addon';
import deployAddon, { IDeployAddonArguments } from './deploy-addon';
import signAddon, { ISignAddonArguments } from './sign-addon';
import { RequestAPI, Options, Request, RequiredUriUrl } from 'request';

export type RequesterAPI = RequestAPI<Request, Options, RequiredUriUrl>;

export interface IApiBaseArguments {
	username: string;
	password: string;
	domain: string;
	siteName: string;
}

export interface IAddonEndpoints {
	create(options: ICreateAddonArguments, requester?: RequesterAPI): Promise<boolean>;
	deploy(options: IDeployAddonArguments, requester?: RequesterAPI): Promise<boolean>;
	sign(options: ISignAddonArguments, requester?: RequesterAPI): Promise<Buffer>;
}

export interface IApi {
	addon: IAddonEndpoints;
}

const api: IApi = {
	addon: {
		create: createAddon,
		deploy: deployAddon,
		sign: signAddon
	}
};

export default api;