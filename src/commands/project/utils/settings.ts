import promtQuestions from '../../../utils/promtQuestions';
import { ICommandHash } from '../../../utils/cli-parser';
import makePaths from './paths';
import { file } from '../../../utils/structure';
import { IGeneralProperties } from '../../../misc/interfaces';

/* istanbul ignore next */
const propertiesQuestions = [
	{
		name: 'domain',
		message: 'Domain (http://www.example.com)',
		validate: (answer: string) => answer && answer.trim() !== '',
		filter: (input: string) => input.replace(/\/$/, '')
	},
	{
		name: 'username',
		message: 'Username for site',
		validate: (answer: string) => answer && answer.trim() !== ''
	},
	{
		name: 'password',
		type: 'password',
		message: 'Password for site',
		validate: (answer: string) => answer && answer.trim() !== ''
	},
	{
		type: 'input',
		name: 'remote_base',
		default: 'files/System',
		message: 'Remote base directory for development files'
	}
];

export interface IProjectSettings extends IGeneralProperties {
	remote_base: string;
}

export interface IProjectSettingsOptions {
	settings?: IProjectSettings;
	production: boolean;
}

/**
 * Generate settings object
 * @param cmd The command that spawned this
 * @param options Object maninly used for testing purposes, if undefined it will read the .app-settings.json file in the webapp directory.
 */
const webappSettings = async (cmd: ICommandHash, options?: IProjectSettingsOptions) => {
	const paths = makePaths(cmd.directoryPath);

	// Find app-settings file in project
	const settingsPath = options.production ?  paths.files.prodSettings : paths.files.settings;

	let settings = await file.readJson<IProjectSettings>(settingsPath)
						.catch(error => {
							return undefined;
						});
	if (!settings) {
		settings = await promtQuestions(propertiesQuestions, options.settings, 'Project settings');
		// Save new settings!
		file.writeFile(settingsPath , JSON.stringify(settings));
	}

	return settings as IProjectSettings;
};


export default webappSettings;