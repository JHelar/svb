module.exports = api => {
	api.extendPackage({
		devDependencies: {
			'@types/clone-deep': '^4.0.1'
		},
		dependencies: {
			'clone-deep': '^4.0.1'
		}
	}),
		api.render('./template');
	api.onCreateComplete(() => {
		const fs = require('fs');
		fs.unlinkSync(api.resolve('./src/store.ts'));

		var deleteFolderRecursive = function(path) {
			if (fs.existsSync(path)) {
				fs.readdirSync(path).forEach(function(file, index) {
					var curPath = path + '/' + file;
					if (fs.lstatSync(curPath).isDirectory()) {
						// recurse
						deleteFolderRecursive(curPath);
					} else {
						// delete file
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(path);
			}
		};

		deleteFolderRecursive('./src/assets');
	});
};
