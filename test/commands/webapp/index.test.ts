import webappCommands from '../../../src/commands/webapp';

describe('Webapp commands', () => {
	it('Commands are defined', done => {
		expect(webappCommands.create).toBeDefined();
		expect(webappCommands.deploy).toBeDefined();
		expect(webappCommands.name).toBeDefined();
		done();
	})
})