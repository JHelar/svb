import { CommandExecuterResult } from '..';
import { ICommandHash } from '../../utils/cli-parser';
import { resolve } from 'path';
import Listr from 'listr';
import execa from 'execa';
import { folder } from '../../utils/structure';

const makeStructure = ({ directoryPath }: ICommandHash) => {
	const copyResolver = ([src, dest]: string[]) => [
		resolve(__dirname, '../../..', src),
		dest
	];

	const copy = [['defaults/project', directoryPath]].map(copyResolver);

	return Promise.all(
		copy.map(([src, dest]: string[]) => folder.copy(src, dest))
	);
};

const installDependencies = ({ directoryPath }: ICommandHash) => {
	return execa(
		'npm',
		[
			'i',
			'-D',
			'webpack',
			'uglifyjs-webpack-plugin',
			'vue-loader',
			'webpack-cli',
			'babel-loader',
			'babel-loader',
			'@babel/core',
			'@babel/preset-env',
			'style-loader',
			'css-loader',
			'vue'
		],
		{ cwd: directoryPath, stderr: process.stderr }
	).then(result => {
		if (result.failed) throw new Error('Could not install dependencies');
		return true;
	});
};

export default async (cmd: ICommandHash): Promise<CommandExecuterResult> => {
	const list = new Listr([
		{
			title: 'Creating folder structure',
			task: () => makeStructure(cmd)
		},
		{
			title: 'Installing project dependencies',
			task: () => installDependencies(cmd)
		}
	]);

	return list
		.run()
		.then(() => ({
			success: true,
			message: `Successfully created project at ${cmd.directoryPath}`
		}))
		.catch((error: Error) => {
			// ToDo: handle error
			return {
				success: false,
				message: error.message
			};
		});
};
