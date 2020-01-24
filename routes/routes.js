const { Router } = require('express');
const { sanoPostman } = require('../controllers/apiExecutor');
const { validateResponse } = require('../validations/responseValidator');
const router = Router();

router.use('/sanoPostman', async (req, res) => {
<<<<<<< HEAD
  const {
    body: { url },
    headers,
    method,
    body,
    params,
    query,
    _parsedUrl
  } = req;
 
  if (!url) {
    throw new Error(`Url is required for making request`);
  }
=======
	const {
		body: { url },
		headers,
		method,
		body,
		query,
	} = req;
	console.log(req.body);
>>>>>>> 091b3b66bd97d002f3816b40854cee8fd6675b02

	if (!url) {
		console.log('Error: URL not found.');
		return res.json({
			status: 400,
			msg: 'URL is required to make a successful request.',
		});
	}

	if (!method) {
		console.log('Error: Method not found.');
		return res.json({
			status: 400,
			msg: 'Method type is required to make a successful request.',
		});
	}
	const request = {};

	if (headers) {
		request.headers = headers;
	}

<<<<<<< HEAD
  if(params) {
    request.params = params
  }

  request.body = body;
  const ree = await sanoPostman(method, url, request);
  
  const check = validateResponse(ree);
  if (check) {
    if (check.status === 406) {
      return res.json(check);
    }
  }

  delete body.url;

  const requestObjectNeeded={
    headers,
    method,
    body,
    query,
    params,
    // _parsedUrl,
    url,
    type: 'request-type'
  }

  ree.request = requestObjectNeeded
  return res.status(ree.status).json(ree);
=======
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
>>>>>>> 091b3b66bd97d002f3816b40854cee8fd6675b02
});

module.exports = router;
