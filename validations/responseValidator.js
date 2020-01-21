const StatusCodes = require('../library/statusCodes');
const message_types = ['text', 'image', 'video', 'audio', 'file', 'cards', 'list'];
function validateResponse(res) {
	try {
		if (res.data) {
			if (!res.data.version) {
				return StatusCodes.validationError(`Invalid Payload message Version is required`, res);
			}

			if (res.data.version !== 'v2') {
				return StatusCodes.validationError(`Invalid Version`, res);
			}
			if (res.data.content) {
				if (res.data.content.messages) {
					if (Array.isArray(res.data.content.messages)) {
						if (!res.data.content.messages[0].type) {
							return StatusCodes.validationError(`Type is required`, res);
						}
						const check = message_types.includes(res.data.content.messages[0].type);
						if (!check) {
							return StatusCodes.validationError(`Unsupported message Type`, res);
						}
					} else {
						return StatusCodes.validationError(`Message should be array`, res);
					}
				} else {
					return StatusCodes.validationError(`Message is required`, res);
				}
			} else {
				return StatusCodes.validationError(`Content is required`, res);
			}
		}
	} catch (err) {
		console.log(`Error while validating the response ${err}`);
		return res.json({
			status: 500,
			msg: 'Server Error',
		});
	}
}

module.exports = {
	validateResponse,
};
