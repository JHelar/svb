import fs from 'fs-extra';
import zipdir from 'zip-dir';

export const folder = {
	create: fs.mkdirp,
	toZipBuffer: (sourcePath: string): Promise<Buffer> => {
		return new Promise((res, rej) => {
			zipdir(sourcePath, (err: any, buffer: Buffer) => {
				if (err) {
					rej(err);
				} else {
					res(buffer);
				}
			});
		});
	},
	copy: fs.copy
};

export const file = {
	writeFile: fs.writeFile,
	readFile: fs.readFile,
	readJson: <TResult>(filePath: string) => fs.readJSON(filePath) as Promise<TResult>,
	copy: fs.copyFile,
};