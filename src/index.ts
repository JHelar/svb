#!/usr/bin/env node
import cli from './utils/cli-parser';
import commander from './commander';

import makeConsole from './utils/console';

const console = makeConsole('SVB');
console.clear();
console.time('Task took');
try {
	const cmd = cli();
	const exec = commander(cmd.command);
	console.info(`${cmd.command.name} ${cmd.command.task}`);
	// Run command
	exec(cmd)
		.then(status => {
			if (status.success) {
				console.success(status.message || 'Good stuff!');
			} else {
				console.error(status.message || 'Uh ooh!');
			}
		})
		.finally(() => {
			console.endTime('Task took');
		});
} catch (e) {
	// console.error(e.message || 'Uh ooh!');
	process.exit(-1);
}
// Done