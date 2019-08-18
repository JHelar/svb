import { escape } from 'querystring';
import { stringify } from 'query-string';
import { post } from '../utils/requestWrapper';
import { IApiBaseArguments, RequesterAPI } from '.';
import makePath from '../commands/webapp/utils/paths';
import { folder } from '../utils/structure';
import guid from 'uuid/v4';

export interface IDeployAddonArguments extends IApiBaseArguments {
	addonName: string;
	zipFile: string | Buffer;
	force: boolean;
	restApp?: boolean;
}

const deployAddon = async (
	{
		zipFile,
		domain,
		siteName,
		addonName,
		password,
		username,
		force,
		restApp
	}: IDeployAddonArguments,
	requester?: RequesterAPI
) => {
	if (typeof zipFile === 'string') {
		const paths = makePath(zipFile);
		zipFile = await folder.toZipBuffer(paths.folders.src);
	}

	const url = `${domain}/rest-api/1/0/${escape(
		siteName
	)}/Addon Repository/${escape(addonName)}/${restApp ? 'restAppImport' : 'webAppImport'}?${stringify({
		force
	})}`;

	const auth = {
		password,
		username
	};
	const headers = {
		'Content-Type': 'multipart/form-data'
	};
	const formData = {
		file: {
			value: zipFile,
			options: {
				filename: `webapp-boiler-${guid()}.zip`
			}
		}
	};

	return post(
		{
			url,
			formData,
			auth,
			headers
		},
		requester
	).then(success => {
		// ToDo: Handle and introspect success data
		return true;
	});
};

export default deployAddon;
