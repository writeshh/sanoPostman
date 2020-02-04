/**
 * Author: Ritesh Shrestha
 */

const { sendSuitableHttpResponse } = require('../library/sendSuitableHttpResponse');

const MESSAGE_TYPES = {
	TEXT: 'text',
	ATTACHMENT: 'attachment',
	IMAGE: 'image',
	MEDIA: 'audio' || 'video',
	FILE: 'file',
	DELAY: 'delay',
	CARDS: 'cards',
	CARD: 'card',
	LIST: 'list',
	OTHER: 'other',
};

const keyboard_types = ['url', 'flow', 'call', 'share', 'node', 'flow', 'content', 'buy', 'dynamic_block_callback'];

const supported_images = ['png', 'jpg', 'jpeg', 'gif'];

const supported_media = ['mp3', 'ogg', 'mpeg', 'mp4', 'avi'];

/**
 *
 * @param {*} res - response object
 * calls validationResponseHandler function with @poram response
 * returns errors if it exits
 * return nothing if errors are found
 */
function validateResponse(res) {
	try {
		const ValidationResponseHandler = validationResponseHandler(res);
		const error = ValidationResponseHandler.handleResponse();

		if (Object.getOwnPropertyNames(error).length > 0) {
			return sendSuitableHttpResponse(406, res, error);
		}
	} catch (err) {
		console.log(err);
		return sendSuitableHttpResponse(406, err);
	}
}

/**
 *
 * @param {*} res - response object
 * collection of functions to validate the response and its contents
 */
function validationResponseHandler(res) {
	const { data } = res;
	const error = {};

	/**
	 *
	 * @param {*} contentImageData - object
	 * handles the validation for image
	 */
	function handleContentDataForImage(contentImageData) {
		if (!(contentImageData.img_big && contentImageData.img_small)) {
			error.content.push('Image is required');
		}

		if (!supported_images.includes(contentImageData.img_big.split('.').pop())) {
			error.image = `Image format can be of only following types ${supported_images}`;
		}
	}

	/**
	 *
	 * @param {*} contentFileData - object
	 *  handles validation for Attachments (Audio, Video, File)
	 */
	function handleContentDataForFile(contentFileData) {
		if (!contentFileData) {
			error.content = 'File is required';
		}

		if (!contentFileData.title) {
			error.title = 'Title is required';
		}

		if (!supported_media.includes(contentFileData.file.split('.').pop())) {
			error.mime = `Attachment format can be of only following types ${supported_media}`;
		}
	}

	function handleContentDataForDelay(contentDelayData) {
		error.delay = [];

		if (!contentDelayData) {
			error.delay.push('Delay is required');
		}

		if (!contentDelayData.time) {
			error.delay.push('Time is required');
		}

		if (contentDelayData.time) {
			if (contentDelayData.time > 15) {
				error.delay.push('Max time is 15 seconds');
			}
		}

		if (typeof show_typing !== 'boolean') {
			error.delay.push('Show typing should either be true or false');
		}

		if (error.delay.length === 0) {
			delete error.delay;
		}
	}

	/**
	 *
	 * @param {*} contentElementData - object
	 * handles validation for each element data (cards and lists)
	 *
	 */
	function handleContentDataForElements(contentElementData) {
		if (!contentElementData) {
			error.content.push('Card cannot be empty.');
		}

		if (!contentElementData.image) {
			error.content.push('Image is required');
		}

		if (!contentElementData.content.title) {
			error.content.push('Title is required');
		}

		if (contentElementData.content.title) {
			if (contentElementData.content.title.length > 640) {
				error.content.push('Max number of Character is 640 for title');
			}
		}

		if (contentElementData.content.subtitle) {
			if (contentElementData.content.subtitle.length > 640) {
				error.content.push('Max number of Character is 640 for subtitle');
			}
		}
		if (contentElementData.image) {
			handleContentDataForImage(contentElementData.image);
		}
	}

	/**
	 *
	 * @param {*} contentData - object
	 * checks the content type and calls suitable validation handler
	 */
	function handleContentData(contentData) {
		error.content = [];

		if (contentData.type === MESSAGE_TYPES.IMAGE) {
			handleContentDataForImage(contentData);
		}
		if (contentData.type === MESSAGE_TYPES.FILE) {
			handleContentDataForFile(contentData);
		}
		if (contentData.type === MESSAGE_TYPES.CARD || contentData.type === MESSAGE_TYPES.LIST) {
			handleContentDataForElements(contentData);
			error.content.length == 0 ? delete error.content : '';
		}

		if (error.content.length === 0) {
			delete error.content;
		}
	}

	/**
	 *
	 * @param {*} content - object
	 * handles the validation for content and calls the detailed validation handler function
	 */
	function handleContent(content) {
		if (!content) {
			error.content = 'Content is required!';
		}

		if (content.text) {
			if (content.text.length < 0) {
				error.text = 'Text cannot be empty';
			}

			if (content.text.length > 640) {
				error.text = 'Max number of Character is 640 for texts.';
			}
		}

		if (content.data) {
			handleContentData(content.data);
		}
	}

	/**
	 *
	 * @param {*} elements
	 * loops the array of elements and handles each content
	 */
	function handleElements(elements) {
		let index = 0;
		elements.forEach(element => {
			handleContentData(element);
			handleKeyboards(element.keyboard);
			index++;
		});
	}

	/**
	 *
	 * @param {*} keyboards - array of keyboards
	 * loops the array of keyboards and calls the handleIndividualKeyboard() function
	 */
	function handleKeyboards(keyboards) {
		if (keyboards.length > 0) {
			error.keyboards = [];

			if (!Array.isArray(keyboards)) {
				error.keyboards.push('Keyboards must be an array.');
			}
			if (keyboards && keyboards.length > 3) {
				error.keyboards.push('Keyboards must not be more than 3.');
			}

			let index = 0;
			keyboards.forEach(keyboardElem => {
				if (!keyboardElem.caption) {
					error.keyboards[index] = [index] + ' => Caption is required';
				}
				handleIndividualKeyboard(keyboardElem, index);
				index++;
			});
		}
	}

	/**
	 *
	 * @param {*} keyboard - single keyboard object
	 * @param {*} index - index of the keyboards array
	 */
	function handleIndividualKeyboard(keyboard, index) {
		try {
			if (!keyboard_types.includes(keyboard.type)) {
				error.keyboards.push(`[ ${index} ] => Keyboards can be of only following types ${keyboard_types}`);
			}

			if (keyboard.caption.length > 20) {
				error.keyboards.push(`[ ${index} ] => Max characters should be less than 20`);
			}

			// if keyboard type is URL
			if (keyboard.type == 'url') {
				const urlRegex = new RegExp(
					/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
				);
				// validation of regex at regexr.com/4tbhv

				if (!keyboard.url) {
					error.keyboards.push(`[ ${index} ] => URL is required`);
				}

				if (!keyboard.webview_size) {
					error.keyboards.push(`[ ${index} ] => Webview size is required.`);
				}

				if (keyboard.url) {
					if (!keyboard.url.match(urlRegex)) {
						error.keyboards.push(` [ ${index} ] => URL format is is not valid.`);
					}
				}
			}

			// if keyboard type is content
			if (keyboard.type == 'content') {
				if (!keyboard._content_oid) {
					error.keyboards.push(`[ ${index} ] => Content OID is required`);
				}
			}

			// if keyboard type is call
			if (keyboard.type == 'call') {
				const phoneRegex = new RegExp(
					/(\+?( |-|\.)?\d{1,4}( |-|\.)?)?(\(?\d{3}\)?|\d{3})( |-|\.)?(\d{3}( |-|\.)?\d{4})/g,
				);
				// Break down of regex at: regexr.com/4tbhd

				if (!keyboard.phone) {
					error.keyboards.push(`[ ${index} ] => Phone number is required`);
				}

				if (keyboard.phone) {
					if (!keyboard.phone.match(phoneRegex)) {
						error.keyboards.push(` [ ${index} ] => Not a valid phone number`);
					}
				}
			}
		} catch (err) {
			console.log(err);
		}
	}

	/**
	 *
	 * @param {*} textData
	 */
	function handleResponseForText(textData) {
		handleContent(textData.content);
		if (textData.quick_replies) {
			handleKeyboards(textData.buttons);
		}
		handleKeyboards(textData.keyboard);
	}

	/**
	 *
	 * @param {*} attachmentData
	 */
	function handleResponseForAttachment(attachmentData) {
		console.log(attachmentData);

		handleContent(attachmentData.content);
		handleKeyboards(attachmentData.keyboard);
	}

	/**
	 *
	 * @param {*} delayData
	 */
	function handleResponseForDelay(delayData) {
		handleContentDataForDelay(delayData);
	}

	/**
	 *
	 * @param {*} elementData - object
	 */
	function handleResponseForElements(elementData) {
		handleElements(elementData);
	}

	/**
	 * handleResponse()
	 * -> checks the message type of the response and call suitable response handler
	 * returns errors found
	 */
	function handleResponse() {
		if (data.type === MESSAGE_TYPES.TEXT) {
			handleResponseForText(data);
		}

		if (data.type === MESSAGE_TYPES.ATTACHMENT) {
			handleResponseForAttachment(data);
		}

		if (data.type === MESSAGE_TYPES.DELAY) {
			handleResponseForDelay(data);
		}

		if (data.type === MESSAGE_TYPES.CARDS) {
			handleResponseForElements(data.elements);
		}

		if (data.type === MESSAGE_TYPES.LIST) {
			handleResponseForElements(data.elements);
		}

		return error;
	}

	return {
		handleResponse,
	};
}

module.exports = {
	validateResponse,
};
