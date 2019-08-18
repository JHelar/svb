import { escape } from 'querystring';
import { IApiBaseArguments, RequesterAPI } from '.';
import { WebappCategory } from '../commands/webapp/utils/settings';
import { post } from '../utils/requestWrapper';

export interface ICreateAddonArguments extends IApiBaseArguments {
	addonName: string;
	category?: WebappCategory;
	restApp?: boolean;
}

const createAddon = (
	{
		username,
		domain,
		password,
		siteName,
		addonName,
		category,
		restApp
	}: ICreateAddonArguments,
	requester?: RequesterAPI
) => {
	const url = `${domain}/rest-api/1/0/${escape(
		siteName
	)}/Addon Repository/${restApp ? 'headlesscustommodule' : 'custommodule'}`;
	const data = {
		name: addonName,
		category
	};
	const auth = {
		password,
		username
	};

	return post({
		url: url,
		auth,
		form: data
	}, requester)
	.then(success => {
		// ToDo: introspect success data and return proper
		return true;
	})
};

export default createAddon;
