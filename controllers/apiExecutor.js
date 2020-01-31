/**
 * Author: Kiran Adhikari
 * Editor: Ritesh Shrestha
 */

const axios = require('axios');
const qs = require('querystring');

const { sendSuitableHttpResponse } = require('../library/sendSuitableHttpResponse');
const { validateResponse } = require('../validator/responseValidator');

const METHODS = {
	GET: 'GET' || 'get',
	POST: 'POST' || 'post',
	PUT: 'PUT' || 'put',
	PATCH: 'PATCH' || 'patch',
	DELETE: 'DELETE' || 'delete',
	OPTIONS: 'OPTIONS' || 'options',
};

/**
 *
 * @param {*} method
 * @param {*} url
 * @param {*} request
 */
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

		if (method === METHODS.GET) {
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

		if (method === METHODS.POST) {
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
		res.json(sendSuitableHttpResponse(500, err));
		throw new Error(`Error while creating sano Post Man ${err}`);
	}
}

// Test the API Response
exports.testApiResponse = async (req, res) => {
	try {
		const {
			body: { url },
			headers,
			method,
			body,
			params,
			query,
		} = req;
		let errResp = '';

		console.log(body);

		if (!url) {
			console.log(`Url is required for making request`);
			errResp = sendSuitableHttpResponse(406, 'URL is required for making request');
			return res.json(errResp);
		}

		if (!method) {
			console.log(`Method is required for making request`);
			return sendSuitableHttpResponse(406, 'Method is required for making request');
		}
		const request = {};

		if (headers) {
			request.headers = headers;
		}

		if (query) {
			request.query = query;
		}

		if (params) {
			request.params = params;
		}

		request.body = body;
		const ree = await sanoPostman(method, url, request);

		if (typeof ree.data === 'string') {
			return res.json(sendSuitableHttpResponse(400, 'Response data must be a JSON Object'));
		}

		const check = validateResponse(ree);

		if (check) {
			if (check.status === 406) {
				return res.json(check);
			}
		}

		delete body.url;

		const requestObject = {
			headers,
			method,
			body,
			query,
			params,
			url,
		};
		ree.request = requestObject;
		return res.status(ree.status).json(ree);
	} catch (err) {
		return sendSuitableHttpResponse(500, err);
		throw new Error(`Can't send response by the API ${err}`);
	}
};
