import promtQuestions from '../../../utils/promtQuestions';
import { ICommandHash } from '../../../utils/cli-parser';
import makePaths from './paths';
import { file } from '../../../utils/structure';
import { IManifestData } from '../restapp-create';
import { IGeneralProperties } from '../../../misc/interfaces';

/* istanbul ignore next */
const signQuestions = [
	{
		name: 'username',
		message: 'Username for developer.sitevision.se',
		validate: (answer: string) => answer && answer.trim() !== ''
	},
	{
		name: 'password',
		type: 'password',
		message: 'Password for developer.sitevision.se',
		validate: (answer: string) => answer && answer.trim() !== ''
	},
	{
		name: 'name',
		message: 'Certificate name for signing (blank for default)'
	}
];

/* istanbul ignore next */
const propertiesQuestions = [
	{
		name: 'domain',
		message: 'Domain (http://www.example.com)',
		validate: (answer: string) => answer && answer.trim() !== '',
		filter: (input: string) => input.replace(/\/$/, '')
	},
	{
		name: 'siteName',
		message: 'Site name (name on the SiteVision "house")',
		validate: (answer: string) => answer && answer.trim() !== ''
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
		name: 'created',
		type: 'confirm',
		message: 'Is this restapp allready created?',
		default: false
	}
];

export interface IRestAppSignOptions {
	username?: string;
	password?: string;
	name?: string;
}

export interface IRestAppPropertiesOptions extends IGeneralProperties {
	siteName?: string;
	addonName?: string;
	created: boolean;
}

export interface IRestAppSettingsOptions {
	sign?: IRestAppSignOptions;
	properties?: IRestAppPropertiesOptions;
	production?: boolean;
}
/**
 * Generate settings object
 * @param cmd The command that spawned this
 * @param options Object maninly used for testing purposes, if undefined it will read the .app-settings.json file in the webapp directory.
 */
const restappSettings = async (cmd: ICommandHash, options?: IRestAppSettingsOptions) => {
	const paths = makePaths(cmd.directoryPath);
	const isProduction = options && options.production;
	// Find app-settings file in project
	const settingsPath = options && options.production ? paths.files.prodSettings : paths.files.settings;

	const prodSettings = await file.readJson<IRestAppSettingsOptions>(paths.files.prodSettings)
				.catch(error => {
					// ToDo: Handle error!
					return undefined;
				}) as IRestAppSettingsOptions;

	const devSettings = await file.readJson<IRestAppSettingsOptions>(paths.files.settings)
				.catch(error => {
					// ToDo: Handle error!
					return undefined;
				}) as IRestAppSettingsOptions;

	let settings = isProduction ? prodSettings : devSettings;

	const getSignOptions = async (signOptions?: IRestAppSignOptions) => {
		const defaults: IRestAppSignOptions = isProduction ? devSettings.sign : undefined;
		return promtQuestions(signQuestions, signOptions, 'Signing details, NOTE: Make sure that the certificate is allready installed on the target SiteVision environment!', defaults);
	};

	const getPropertiesOptions = async (propertiesOptions?: IRestAppPropertiesOptions) => {
		let appName = propertiesOptions && propertiesOptions.addonName;
		const defaults: IRestAppPropertiesOptions = isProduction ? devSettings.properties : undefined;

		if (!appName) {
			// Fetch app name from manifest (If there is one...?)
			appName = await file.readJson<IManifestData>(paths.files.manifest)
				.then(({ name }) => {
					return name;
				})
				.catch(error => {
					// ToDo: Handle error!
					return undefined;
				});
		}
		// This happens usually if the users didnt use restapp create...
		if (!appName) throw new Error('No restapp manifest.json file found!');

		return promtQuestions<IRestAppPropertiesOptions, IGeneralProperties>(propertiesQuestions, propertiesOptions, `Settings for the ${options.production ? 'production' : 'development'} environment.`, defaults)
			.then(answers => ({
				...answers,
				addonName: appName
			}));
	};

	const sign = await getSignOptions(settings ? settings.sign : options ? options.sign : undefined);
	const properties = await getPropertiesOptions(settings ? settings.properties : options ? options.properties : undefined);

	if (!settings) {
		// Save new settings!
		settings = {
			sign,
			properties
		};
		file.writeFile(settingsPath , JSON.stringify(settings));
	}

	return settings;
};


export default restappSettings;