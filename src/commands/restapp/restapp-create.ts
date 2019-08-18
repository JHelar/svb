import { ICommandHash } from "../../utils/cli-parser";
import { folder, file } from '../../utils/structure';
import promtQuestions from "../../utils/promtQuestions";
import { resolve } from "path";
import Listr from 'listr';
import makePaths from './utils/paths';
import { CommandExecuterResult } from "..";
import execa, { ExecaChildProcess } from "execa";


// Cannot test these yet (need to figure out a way to simulate stdin?)
/* istanbul ignore next */
const manifestQuestions = [
	{
		name: 'id',
		type: 'input',
		message: 'Webapp id',
		validate: (answer: string) => answer && answer.trim() !== ''
	},
	{
		name: 'name',
		type: 'input',
		message: 'Webapp name (this name will be the module name!)',
		validate: (answer: string) => answer && answer.trim() !== ''
	},
	{
		name: 'author',
		type: 'input',
		message: 'Webapp author',
		default: 'HiQ Mälardalen',
		validate: (answer: string) => answer ? true : false,
	},
	{
		name: 'description',
		type: 'input',
		message: 'Description of webapp',
		default: ' ',
		validate: (answer: string) => answer ? true : false
	},
	{
		name: 'helpUrl',
		type: 'input',
		message: 'Help url',
		default: 'https://www.hiq.se',
		validate: (answer: string) => answer && answer.trim() !== ''
		// ToDo: validate the url?
	}
];

const makeStructure = (baseDirectoryPath: string) => {
	const copyResolver = ([ src, dest ]: string[]) => [ resolve(__dirname, '../../..', src), dest ];

	const copy = [
		['defaults/restapp', baseDirectoryPath],
	].map(copyResolver);

	// First wait for folders to be created, then add files.
	return Promise.all(copy.map(([ src, dest ]: string[]) => folder.copy(src, dest)));
};

export interface IManifestData extends ICreateOptions {
	version: string;
	type: string;
}

const makeManifest = async (baseDirectoryPath: string, options?: ICreateOptions) => {
	const manifest = await promtQuestions(manifestQuestions, options, 'Webapp manifest details')
		.then(manifestOptions => {
			const manifest: IManifestData = {
				...manifestOptions,
				version: '0.0.1',
				type: 'RESTApp'
			};
			return manifest;
		});

	return () => file.writeFile(
			resolve(baseDirectoryPath, 'src/manifest.json'),
			JSON.stringify(manifest)
		);
};

export interface ICreateOptions {
	id?: string;
	name?: string;
	author?: string;
	description?: string;
	helpUrl?: string;
}

export default async (cmd: ICommandHash, options?: ICreateOptions): Promise<CommandExecuterResult> => {
	const saveManifest = await makeManifest(cmd.directoryPath, options);
	const tasks = [
		{
			title: 'Create folder structure',
			task: () => makeStructure(cmd.directoryPath)
		},
		{
			title: 'Save manifest.json file',
			task: () => saveManifest()
		}
	];
	const list = new Listr(tasks);

	return list.run()
		.then(() => ({
			success: true,
			message: `Successfully created webapp at ${cmd.directoryPath}`
		}))
		.catch((error: Error) => {
			// ToDo: handle error
			return {
				success: false,
				message: error.message
			};
		});
};