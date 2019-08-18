import { ICommandHash } from "../../utils/cli-parser";
import { folder, file } from '../../utils/structure';
import promtQuestions from "../../utils/promtQuestions";
import { resolve } from "path";
import Listr from 'listr';
import makePaths from './utils/paths';
import { CommandExecuterResult } from "..";
import execa from "execa";
import guid from 'uuid/v4';
import isWindows from 'is-windows';
import { pathExists, readFile, writeFile } from "fs-extra";


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

const makeStructure = (baseDirectoryPath: string, vue: boolean) => {
	const copyResolver = ([ src, dest ]: string[]) => [ resolve(__dirname, '../../..', src), dest ];
	const paths = makePaths(baseDirectoryPath);

	const createFolders = Object.values(paths.folders);
	const copy = [
		[vue ? 'defaults/webapp/vue' : 'defaults/webapp/no-vue', baseDirectoryPath],
		['defaults/webapp/gitignore', paths.files.ignore]
	].map(copyResolver);

	// First wait for folders to be created, then add files.
	return Promise.all(createFolders.map(path => folder.create(path)))
		.then(() => Promise.all(copy.map(([ src, dest ]: string[]) => folder.copy(src, dest))));
};

export interface IManifestData extends ICreateOptions {
	version: string;
	type: string;
}

const instantiateVue = async (baseDirectoryPath: string): Promise<CommandExecuterResult> => {
	const paths = makePaths(baseDirectoryPath);
	const vueRootPath = isWindows() ? paths.vue.vue : paths.vue.root;

	// Check if @vue/cli is installed globally
	await execa('npm', ['list', '-g', '@vue/cli'], { cwd: vueRootPath, stdout: process.stdout, stdin: process.stdin,  })
		.catch(error => {
			throw new Error('@vue/cli is not installed, please run "npm i -g @vue/cli"');
		});
	return execa('vue', ['create', isWindows() ? 'display' : '.', '--preset', resolve(__dirname, '../../..', 'defaults/vue-presets'), '--no-git', '--force'], { cwd: vueRootPath })
		.then(vueCreateResult => {
			if (vueCreateResult.failed) {
				throw new Error('Could not instantiate vue');
			}
			return {
				success: true,
				message: 'Webapp with vue created!'
			};
		});
};

const setAppName = async (baseDirectoryPath: string, appName: string) => {
	const paths = makePaths(baseDirectoryPath);
	const appNameFiles = [
		`${paths.vue.src}/main.ts`,
		paths.files.main
	];
	appNameFiles.forEach(async file => {
		const exists = await pathExists(file);
		if (exists) {
			const fileBuffer = await readFile(file);
			const fileContents = fileBuffer.toString();
			const newFileContents = fileContents.replace(/APP_NAME/g, appName);
			await writeFile(file, newFileContents);
		}
	});
};

const makeManifest = async (baseDirectoryPath: string, options?: ICreateOptions) => {
	const manifest = await promtQuestions(manifestQuestions, options, 'Webapp manifest details')
		.then(manifestOptions => {
			const manifest: IManifestData = {
				...manifestOptions,
				version: '0.0.1',
				type: 'WebApp'
			};
			return manifest;
		});

	return async () => {
		await file.writeFile(
			resolve(baseDirectoryPath, 'src/manifest.json'),
			JSON.stringify(manifest)
		);
		return manifest;
	};
};

export interface ICreateWebappTask extends ICommandHash {
	vue: boolean;
}

export interface ICreateOptions {
	id?: string;
	name?: string;
	author?: string;
	description?: string;
	helpUrl?: string;
}

export default async (cmd: ICreateWebappTask, options?: ICreateOptions): Promise<CommandExecuterResult> => {
	const saveManifest = await makeManifest(cmd.directoryPath, options);
	const tasks: { title: string, task: (ctx?: { manifest: IManifestData }) => Promise<any> }[] = [
		{
			title: 'Create folder structure',
			task: () => makeStructure(cmd.directoryPath, cmd.vue)
		},
		{
			title: 'Save manifest.json file',
			task: async ctx => {
				ctx.manifest = await saveManifest();
			}
		}
	];
	if (cmd.vue) {
		tasks.push({
			title: 'Setting up vue environment (this usually takes a while ~1-2min)',
			task: ctx => instantiateVue(cmd.directoryPath)
				.then(result => {
					if (result.success) {
						return setAppName(cmd.directoryPath, guid().replace(/-/g, ''));
					} else {
						throw result;
					}
				})
				.then(() => {})
		});
	}
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