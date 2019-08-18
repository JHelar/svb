import { Question, prompt } from "inquirer";
import makeConsole from './console';

const console = makeConsole('SVHIQ');

export default <TOptions = { [key: string]: any }, TDefaults = TOptions>(questions: Question[], options?: TOptions, title?: string, defaults?: TDefaults): Promise<TOptions> => {
	if (options) {
		// Filter out questions that are allready set in options.
		Object.keys(options).forEach(key => {
			questions = questions.filter(q => q.name !== key);
		});
	} else {
		/* istanbul ignore next */
		options = {} as TOptions;
	}

	if (questions.length && title) {
		console.info(title);
		console.info('Default values in between (), press enter to use default value.');
	}
	if (defaults) {
		// Set defaults
		Object.keys(defaults).forEach(key => {
			const qIndex = questions.findIndex(q => q.name === key);

			if (qIndex > -1) {
				questions[qIndex].default = (defaults as any)[key];
			}
		});
	}

	return prompt(questions)
		.then((answers: TOptions) => {
			return {
				...options,
				...answers
			};
		});
};