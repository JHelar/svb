import apiInstance, { IApi } from '../../api';
import { ICommandHash } from '../../utils/cli-parser';
import makePaths from './utils/paths';
import { file } from '../../utils/structure';
import restappSettings from './utils/settings';
import Listr from 'listr';
import { CommandExecuterResult } from '..';

export interface IDeployRestAppTask extends ICommandHash {
	force: boolean;
	production: boolean;
}

const deploy = async (cmd: IDeployRestAppTask, api: IApi = apiInstance): Promise<CommandExecuterResult> => {
	// Check if addon is created
	const paths = makePaths(cmd.directoryPath);

	// Calling this guarantees us that we get the settings!
	const settings = await restappSettings(cmd, { production: cmd.production });
	const tasks = new Listr([
		{
			title: 'Creating addon on target',
			skip: () => {
				if (settings.properties.created) {
					return 'Addon allready created on target';
				}
			},
			task: () => api.addon.create({
					addonName: settings.properties.addonName,
					domain: settings.properties.domain,
					password: settings.properties.password,
					siteName: settings.properties.siteName,
					username: settings.properties.username,
					restApp: true
				}).then(created => {
					if (created) {
						settings.properties.created = true;
						return file.writeFile(paths.files.settings, JSON.stringify(settings));
					} else {
						throw new Error('Could not create settings!');
					}
				})
				.catch(() => {
					throw new Error(`Could not create addon to target, make sure the details in ${paths.files.settings} are correct!`);
				})
				.then(() => {
					return 'Addon created!';
				})
		},
	]);

	tasks.add([
		{
			title: 'Signing addon',
			task: ctx => api.addon.sign({
				appId: settings.properties.addonName,
				baseDirectoryPath: cmd.directoryPath,
				certificateName: settings.sign.name,
				sitevisionPassword: settings.sign.password,
				sitevisionUsername: settings.sign.username,
			}).then(zipFile => {
				if (zipFile) {
					ctx.zipFile = zipFile;
					return 'Signed!';
				} else {
					throw new Error('Could not deploy!');
				}
			})
		},
		{
			title: 'Deploying addon to target',
			task: ctx => api.addon.deploy({
				domain: settings.properties.domain,
				password: settings.properties.password,
				siteName: settings.properties.siteName,
				username: settings.properties.username,
				addonName: settings.properties.addonName,
				zipFile: ctx.zipFile,
				force: cmd.force,
				restApp: true
			}).then(success => {
				if (success) {
					return 'Deployed!';
				}
				else {
					throw new Error('Could not deploy!');
				}
			})
		}
	]);
	// Create addon
	return await tasks.run()
		.then(() => {
			return {
				success: true,
				message: `Successfully deployed RESTApp!`
			};
		})
		.catch(error => {
			// ToDo: handle error
			return {
				success: false,
				message: error.message
			};
		});
};

export default deploy;