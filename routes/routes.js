const { Router } = require('express');
const { sanoPostman } = require('../controllers/apiExecutor');
const { validateResponse } = require('../validations/responseValidator');
const router = Router();

router.use('/sanoPostman', async (req, res) => {
	const {
		body: { url },
		headers,
		method,
		body,
		query,
	} = req;
	console.log(req.body);

	if (!url) {
		console.log('"Error - " URL not found.');
		return res.json({
			status: 400,
			msg: 'URL is required to make a successful request.',
		});
	}

	if (!method) {
		console.log('"Error - " Method not found.');
		return res.json({
			status: 400,
			msg: 'Method type is required to make a successful request.',
		});
	}
	const request = {};

	if (headers) {
		request.headers = headers;
	}

	if (query) {
		request.query = query;
	}

	request.body = body;
	const ree = await sanoPostman(method, url, request);
	const check = validateResponse(ree);
	if (check) {
		if (check.status === 609) {
			return res.json(check);
		}
	}
	return res.status(ree.status).json(ree);
});

module.exports = router;
