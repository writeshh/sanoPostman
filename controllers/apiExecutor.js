const axios = require('axios');
const qs = require('querystring');
const { sendSuitableHttpResponse } = require('../library/sendSuitableHttpResponse');

async function sanoPostman(method, url, request) {
	try {
		const { headers, body, query } = request;
		const config = {};
		if (Object.keys(query).length > 0) {
			config.params = query;
		}
		delete headers.host;
		delete headers.cookie;
		delete headers.connection;
		delete headers['user-agent'];
		delete headers['postman-token'];
		delete headers['content-length'];
		delete headers['accept-encoding'];
		delete headers['cache-control'];
		config.headers = {
			...headers,
		};
		if (method === 'GET') {
			try {
				const response = await axios.get(url, config);
				return sendSuitableHttpResponse(response.status, response.data);
			} catch (err) {
				if (err.response) {
					return sendSuitableHttpResponse(err.response.status, err.message);
				}
				return sendSuitableHttpResponse(404, err);
			}
		}
		if (method === 'POST') {
			try {
				let data;
				if (headers['content-type'] === 'application/json') {
					data = body;
				} else {
					data = qs.stringify(body);
				}
				const response = await axios.post(url, data, config);
				return sendSuitableHttpResponse(response.status, response.data);
			} catch (err) {
				if (err.response) {
					return sendSuitableHttpResponse(err.response.status, err.message);
				}
				return sendSuitableHttpResponse(404, err);
			}
		}
	} catch (err) {
		throw new Error(`Error while creating sano Post Man ${err}`);
	}
}

module.exports = {
	sanoPostman,
};
