module.exports = {
	preset: 'ts-jest',
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		}
	},
	moduleFileExtensions: ['ts', 'js'],
	testMatch: ['**/test/**/*.test.(ts|js)'],
	testEnvironment: 'node',
	bail: true,
	timers: 'fake',
};
