exports.sendSuccessResponse = data => {
	return {
		status: 200,
		statusText: 'OK',
		data,
	};
};

exports.methodNotAllowed = msg => {
	return {
		status: 405,
		statusText: 'Message Not Allowed',
		msg,
	};
};

exports.validationError = (msg, data) => {
	return {
		status: 609, //Custom validation Error Status Code
		statusText: 'Validation Failed',
		msg,
		data,
	};
};

exports.unauthorizedUser = msg => {
	return {
		status: 401,
		statusText: 'Unauthorized',
		msg,
	};
};

exports.forbidden = (msg, data) => {
	return {
		status: 403,
		statusText: 'Forbidden',
		msg,
		data,
	};
};

exports.notFound = msg => {
	return {
		status: 404,
		statusText: 'Not Found',
		msg,
	};
};

exports.created = msg => {
	return {
		status: 201,
		statusText: 'Created',
		msg,
	};
};
