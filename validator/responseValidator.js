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
	CARDS: 'cards',
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
	const ValidationResponseHandler = validationResponseHandler(res);
	const error = ValidationResponseHandler.handleResponse();

	if (Object.getOwnPropertyNames(error).length > 0) {
		return sendSuitableHttpResponse(406, res, error);
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

		if (!contentElementData.title) {
			error.content.push('Title is required');
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
		if (contentData.type === 'card' || contentData.type === 'list') {
			handleContentDataForElements(contentData);
			error.content.length == 0 ? delete error.content : '';
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
		if (!keyboard_types.includes(keyboard.type)) {
			error.keyboards.push(`[ ${index} ] => Keyboards can be of only following types ${keyboard_types}`);
		}

		// if keyboard type is URL
		if (keyboard.type == 'url') {
			if (!keyboard.url) {
				error.keyboards.push([index] + ' => URL is required');
			}

			if (!keyboard.webview_size) {
				error.keyboards.push([index] + ' => Webview size is required.');
			}
		}

		// if keyboard type is content
		if (keyboard.type == 'content') {
			if (!keyboard._content_oid) {
				error.keyboards.push([index] + ' => Content OID is required');
			}
		}

		// if keyboard type is call
		if (keyboard.type == 'call') {
			if (!keyboard.phone) {
				error.keyboards.push([index] + ' => Phone number is required');
			}

			if (keyboard.phone) {
				if (keyboard.phone !== '@"^(+[0-9]{9})$"') {
					error.keyboards.push('Not valid phone number');
				}
				// error.keyboards
			}
		}
	}

	/**
	 *
	 * @param {*} textData
	 */
	function handleResponseForText(textData) {
		handleContent(textData.content);
		handleKeyboards(textData.keyboard);
	}

	/**
	 *
	 * @param {*} imageData
	 */
	function handleResponseForImage(imageData) {
		handleContent(imageData.content);
		handleKeyboards(imageData.keyboard);
	}

	/**
	 *
	 * @param {*} mediaData
	 */
	function handleResponseForMedia(mediaData) {
		handleContent(mediaData.content);
		handleKeyboards(mediaData.keyboard);
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
			handleResponseForImage(data);
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
