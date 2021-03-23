import FileSystem from 'fs';
import path from 'path';
class logger {
	errorLog(baseURL, message) {
		let DAY = new Date().getDate();
		if (DAY < 10) {
			DAY = `0${DAY}`;
		}
		let MIN = new Date().getMinutes();
		if (MIN < 10) {
			MIN = `0${MIN}`;
		}
		let HOURS = new Date().getHours();
		if (HOURS < 10) {
			HOURS = `0${HOURS}`;
		}
		const YEAR = new Date().getFullYear();
		let MONTH = new Date().getMonth();
		if (MONTH < 10) {
			MONTH = `0${MONTH}`;
		}
		let SECONDS = new Date().getSeconds();
		if (SECONDS < 10) {
			SECONDS = `0${SECONDS}`;
		}
		const FILE_PATH = `${DAY}-${MONTH}-${YEAR}.txt`;
		let absPath = path.join('./log/error/', FILE_PATH);
		const ERROR_MESSAGE = `${MIN}:${HOURS}:${SECONDS} ${DAY}-${MONTH}-${YEAR}: ${baseURL} ${message}\n`;
		FileSystem.appendFile(absPath, ERROR_MESSAGE, (err) => {});
	}
	accessLog(baseURL) {
		let DAY = new Date().getDate();
		if (DAY < 10) {
			DAY = `0${DAY}`;
		}
		let MIN = new Date().getMinutes();
		if (MIN < 10) {
			MIN = `0${MIN}`;
		}
		let HOURS = new Date().getHours();
		if (HOURS < 10) {
			HOURS = `0${HOURS}`;
		}
		const YEAR = new Date().getFullYear();
		let MONTH = new Date().getMonth();
		if (MONTH < 10) {
			MONTH = `0${MONTH}`;
		}
		let SECONDS = new Date().getSeconds();
		if (SECONDS < 10) {
			SECONDS = `0${SECONDS}`;
		}
		const FILE_PATH = `${DAY}-${MONTH}-${YEAR}.txt`;
		let absPath = path.join('./log/access/', FILE_PATH);
		const ERROR_MESSAGE = `${MIN}:${HOURS}:${SECONDS} ${DAY}-${MONTH}-${YEAR}: ${baseURL}\n`;
		FileSystem.appendFile(absPath, ERROR_MESSAGE, (err) => {});
	}
}
export default logger;
