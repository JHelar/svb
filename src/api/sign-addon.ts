import { stringify } from 'query-string';
import makePath from '../commands/webapp/utils/paths';
import { folder } from '../utils/structure';
import { post } from '../utils/requestWrapper';
import { RequesterAPI } from '.';
import guid from 'uuid/v4';

export interface ISignAddonArguments {
	baseDirectoryPath: string;
	sitevisionUsername: string;
	sitevisionPassword: string;
	appId: string;
	certificateName?: string;
}

const signAddon = async (
	{
		baseDirectoryPath,
		sitevisionPassword,
		sitevisionUsername,
		certificateName
	}: ISignAddonArguments,
	requester?: RequesterAPI
): Promise<Buffer> => {
	const paths = makePath(baseDirectoryPath);
	const zipFile = await folder.toZipBuffer(paths.folders.src);
	// return zipFile;
	const url = `https://developer.sitevision.se/rest-api/appsigner/signapp?${stringify(
		{ certificateName }
	)}`;
	const auth = {
		password: sitevisionPassword,
		username: sitevisionUsername
	};
	const headers = {
		'Content-Type': 'multipart/form-data',
		'Accept': 'application/zip'
	};
	const formData = {
		file: {
			value: zipFile,
			options: {
				filename: `webapp-boiler-${guid()}`,
				contentType: 'application/octet-stream'
			}
		}
	};
	return post<Buffer>(
		{
			url,
			formData,
			encoding: null, // Value has to be NULL! this sets the body response to be a buffer.
			auth,
			headers
		},
		requester
	);
};

export default signAddon;
