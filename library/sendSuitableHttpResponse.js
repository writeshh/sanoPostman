const { STATUS_CODES } = require('http');

function sendSuitableHttpResponse(code, data, msg) {
	try {
		for (let codes in STATUS_CODES) {
			if (Number(codes) === code) {
				return {
					status: Number(codes),
					statusText: STATUS_CODES[codes],
					data,
					msg,
				};
			}
		}
	} catch (err) {
		throw new Error(`Error while sending suitable HTTP response ${err}`);
	}
}

module.exports = {
	sendSuitableHttpResponse,
};
