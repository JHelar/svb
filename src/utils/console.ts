import 'colors';

const makeLevels = (tag: string) => {
	return {
		log(message: string, ...args: any[]) {
			console.log.apply(this, [`${tag.bgGreen.white} ${message}`, ...args]);
		},
		info(message: string, ...args: any[]){
			console.info.apply(this, [`${tag.inverse.yellow} ${message}`, ...args]);
		},
		error(message: string, ...args: any[]) {
			console.error.apply(this, [`${tag.bgRed.black} ${message.white}`, ...args]);
		},
		time(name: string) {
			console.time(`${tag.inverse.white} ${name}`);
		},
		endTime(name: string) {
			console.timeEnd(`${tag.inverse.white} ${name}`);
		},
		success(message: string, ...args: any[]) {
			console.log.apply(this, [`${tag.bgGreen.black} ${message.green}`])
		},
		clear: console.clear
	}
}

export default (tag: string) => {
	const levels = makeLevels(tag);
	return levels;
}