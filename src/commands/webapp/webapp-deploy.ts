import apiInstance, { IApi } from '../../api';
import { ICommandHash } from '../../utils/cli-parser';
import makePaths from './utils/paths';
import { file } from '../../utils/structure';
import webappSettings from './utils/settings';
import Listr from 'listr';
import { CommandExecuterResult } from '..';
import buildInjector from './utils/vueBuildInjector';

export interface IDeployWebappTask extends ICommandHash {
	force: boolean;
	vue: boolean;
	production: boolean;
}

const deploy = async (cmd: IDeployWebappTask, api: IApi = apiInstance): Promise<CommandExecuterResult> => {
	// Check if addon is created
	const paths = makePaths(cmd.directoryPath);

	// Calling this guarantees us that we get the settings!
	const settings = await webappSettings(cmd, { production: cmd.production });
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
					category: settings.properties.category,
					domain: settings.properties.domain,
					password: settings.properties.password,
					siteName: settings.properties.siteName,
					username: settings.properties.username
				}).then(created => {
					if (created) {
						settings.properties.created = true;
						const settingsPath = cmd.production ? paths.files.prodSettings : paths.files.settings;
						return file.writeFile(settingsPath, JSON.stringify(settings));
					} else {
						throw new Error('Could not create settings!');
					}
				})
				// .catch(() => {
				// 	return new Error(`Could not create addon to target, make sure the details in ${paths.files.settings} are correct!`);
				// })
		},
	]);

	if (cmd.vue) {
		tasks.add({
			title: 'Checking and building vue application',
			task: () => buildInjector(cmd.directoryPath)
				.then(build => build())
				.then(inject => inject())
		});
	}

	tasks.add([
		{
			title: 'Signing addon',
			task: ctx => api.addon.sign({
				appId: settings.properties.addonName,
				baseDirectoryPath: cmd.directoryPath,
				certificateName: settings.sign.name,
				sitevisionPassword: settings.sign.password,
				sitevisionUsername: settings.sign.username
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
				force: cmd.force
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
				message: `Successfully deployed webapp!`
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