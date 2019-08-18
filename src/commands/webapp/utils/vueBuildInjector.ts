import execa from 'execa';
import paths from './paths';
import fs from 'fs-extra';
import { basename } from 'path';

const jsFileOptions = {
	tag: 'SCRIPT_TAG_TO_JS_FILE',
	element: `<script src="<%= getResourceUrl('REPLACE_ME') %>"></script>`
};

const cssFileOptions = {
	tag: 'LINK_TAG_TO_CSS_FILE',
	element: `<link rel="stylesheet" src="<%= getResourceUrl('REPLACE_ME') %>">`
};

const copyFirstFileOfType = async (sourceDir: string, destDir: string, endsWith: string) => {
	const exists = await fs.pathExists(sourceDir);

	if (exists) {
		const files = await fs.readdir(sourceDir);
		const firstFile = files.find(file => file.endsWith(endsWith));
		if (firstFile) {
			const filename = basename(firstFile);
			fs.copyFile(`${sourceDir}/${firstFile}`, destDir + `/${filename}`);

			return filename;
		}
	}
	return undefined;
};

const injectFilenameToTag = async (filename: string, findTag: string, htmlElement: string, toFile: string) => {
	const toFileBuffer = await fs.readFile(toFile);
	const toFileString = toFileBuffer.toString('utf8');

	// Split to lines
	const newToFile = toFileString.split('\n').reduce((fileString, line, index) => {
		if (line.includes(findTag)) {
			return `${fileString}\n<!--${findTag}-->${htmlElement.replace('REPLACE_ME', filename)}\n`;
		} else if (line) {
			return `${fileString}${line}\n`;
		}
		return fileString;
	}, '');

	// Write the new file.
	return await fs.writeFile(toFile, newToFile);
};

const buildInjector = async (baseDirectoryPath: string) => {
	const path = paths(baseDirectoryPath);

	// Check if there is a vue instance at all.
	const exists = await fs.pathExists(path.vue.root);
	if (!exists) {
		throw new Error('No vue instance found, is this a vue project?');
	}

	const build = () => {
		return execa('npm', ['run', 'build'], {
					cwd: path.vue.root
				})
				.then(buildResult => {
					if (!buildResult.failed) {
						return {
							success: true,
							message: 'Vue build finished'
						};
					} else {
						return {
							success: false,
							message: buildResult.stderr
						};
					}
				});
	};

	const inject = async () => {
		await fs.emptyDir(path.vue.resource);
		await fs.emptyDir(path.folders.css);

		const folderExsits = await fs.pathExists(path.vue.resource);
		if (!folderExsits) {
			await fs.mkdirp(path.vue.resource);
		}

		const jsFilename = await copyFirstFileOfType(path.vue.dist.js, path.vue.resource, '.js');
		await copyFirstFileOfType(path.vue.dist.js, path.vue.resource, '.map');

		const cssFilename = await copyFirstFileOfType(path.vue.dist.css, path.folders.css, '.css');
		await copyFirstFileOfType(path.vue.dist.css, path.folders.css, '.map');

		if (jsFilename) {
			await injectFilenameToTag(`vue/${jsFilename}`, jsFileOptions.tag, jsFileOptions.element, path.files.mainHTML);
		}

		return {
			success: true,
			message: `Copied and injected js: ${jsFilename}, Copied and injected css: ${cssFilename}`
		};
	};

	return () => build().then(buildResult => {
		if (buildResult.success) {
			return inject;
		}
		throw new Error(buildResult.message);
	});
};

export default buildInjector;