import promtQuestions from '../../../utils/promtQuestions';
import { ICommandHash } from '../../../utils/cli-parser';
import makePaths from './paths';
import { file } from '../../../utils/structure';
import { IManifestData } from '../webapp-create';
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
		validate: (answer: string) => answer && answer.trim() !== '',
	},
	{
		name: 'name',
		message: 'Certificate name for signing (blank for default)',
		default: ''
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
		name: 'category',
		type: 'list',
		message: 'What category does this webapp belong in?',
		choices: ['Template', 'PictureAndMedia', 'Integration', 'SocialMedia', 'Interactive', 'Ecommerce', 'Collaboration', 'Other'],
		default: 'Other',
	},
	{
		name: 'created',
		type: 'confirm',
		message: 'Is this webapp allready created?',
		default: false
	},
];

export interface IWebAppSignOptions {
	username?: string;
	password?: string;
	name?: string;
}

export type WebappCategory = 'Template' | 'PictureAndMedia' | 'Integration' | 'SocialMedia' | 'Interactive' | 'Ecommerce' | 'Collaboration' | 'Other';

export interface IWebAppPropertiesOptions extends IGeneralProperties {
	siteName?: string;
	addonName?: string;
	category?: WebappCategory;
	created: boolean;
}

export interface IWebAppSettingsOptions {
	sign?: IWebAppSignOptions;
	properties?: IWebAppPropertiesOptions;
	production?: boolean;
}
/**
 * Generate settings object
 * @param cmd The command that spawned this
 * @param options Object maninly used for testing purposes, if undefined it will read the .app-settings.json file in the webapp directory.
 */
const webappSettings = async (cmd: ICommandHash, options?: IWebAppSettingsOptions) => {
	const paths = makePaths(cmd.directoryPath);
	const isProduction = options && options.production;

	// Find app-settings file in project
	const settingsPath = isProduction ? paths.files.prodSettings : paths.files.settings;

	const prodSettings = await file.readJson<IWebAppPropertiesOptions>(paths.files.prodSettings)
		.catch(error => {
			// ToDo: Handle error!
			return undefined;
		}) as IWebAppSettingsOptions;

	const devSettings = await file.readJson<IWebAppPropertiesOptions>(paths.files.settings)
		.catch(error => {
			// ToDo: Handle error!
			return undefined;
		}) as IWebAppSettingsOptions;

	let settings = isProduction ? prodSettings : devSettings;

	const getSignOptions = async (signOptions?: IWebAppSignOptions) => {
		const defaults: IWebAppSignOptions = isProduction ? devSettings.sign : undefined;
		return promtQuestions(signQuestions, signOptions, 'Signing details, NOTE: Make sure that the certificate is allready installed on the target SiteVision environment!', defaults);
	};

	const getPropertiesOptions = async (propertiesOptions?: IWebAppPropertiesOptions) => {
		let appName = propertiesOptions && propertiesOptions.addonName;
		const defaults = isProduction ? devSettings.properties : undefined;
		const manifest = await file.readJson<IManifestData>(paths.files.manifest)
			.catch(error => {
				// ToDo: Handle error!
				return undefined;
			}) as IManifestData;

		if (!manifest) throw new Error('No webapp manifest.json file found!');
		if (!appName) {
			// Fetch app name from manifest (If there is one...?)
			appName = manifest.name;
		}
		// This happens usually if the users didnt use webapp create...

		return promtQuestions<IWebAppPropertiesOptions, IGeneralProperties>(propertiesQuestions, propertiesOptions, `Settings for the ${isProduction ? 'production' : 'development'} environment.`, defaults)
			.then(answers => ({
				...answers,
				addonName: appName,
				category: answers.category || (devSettings && devSettings.properties.category) || undefined
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


export default webappSettings;