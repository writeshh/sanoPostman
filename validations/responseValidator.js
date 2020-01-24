const { sendSuitableHttpResponse } = require('../library/sendSuitableHttpResponse');

const message_types = ['text', 'image', 'video', 'audio', 'file', 'cards', 'list_item', 'attachment'];

const MESSAGE_TYPES = {
	TEXT: 'text',
	ATTACHMENT: 'attachment',
	// IMAGE: 'image',
	MEDIA: 'audio' || 'video',
	FILE: 'file',
	CARDS: 'cards',
	LIST: 'list_item',
	OTHER: 'other',
};
const keyboard_types = ['url', 'flow', 'call', 'share', 'node', 'flow', 'content', 'buy', 'dynamic_block_callback'];

const supported_images = ['png', 'jpg', 'jpeg'];

const supported_media = ['mp3', 'ogg', 'mpeg', 'mp4', 'avi'];

const mime_types = [
	'audio/mp3' || 'audio/mpeg3',
	'audio/ogg',
	'audio/mpeg',
	'validation/mpeg',
	'video/mp4',
	'video/avi',
	'video/mpeg',
];

function validateResponse(res) {
	const ValidationResponseHandler = validationResponseHandler(res);
	const error = ValidationResponseHandler.handleResponse();

	if (Object.getOwnPropertyNames(error).length !== 0) {
		return sendSuitableHttpResponse(406, res, error);
	} else {
		return;
	}
}

function validationResponseHandler(res) {
	const { data } = res;
	const error = {};

	function handleContentDataForImage(contentImageData) {
		if (!(contentImageData.img_big && contentImageData.img_small)) {
			error.content.push({
				img_big: 'required',
				img_small: 'required',
			});
		}
	}

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

	function handleContentData(contentData) {
		error.content = [];
		if (contentData.type === 'image') {
			handleContentDataForImage(contentData);
		}
		if (contentData.type === 'file') {
			handleContentDataForFile(contentData);
		}
	}

	function handleContent(content) {
		if (!content) {
			error.content = 'Content is required!';
		}
		if (content.data) {
			handleContentData(content.data);
		}
	}

	function handleContentsArray(contentsArray) {
		error.contents = [];
		if (!contentsArray) {
			error.contents = 'Contents is required.';
		}
	}

	function handleElements(elements) {
		error.elements = [];
		let index = 0;
		elements.forEach(element => {
			handleContent(element);
			error.elements.push(error.content);
			handleKeyboardArr(element);
			error.elements.push(error.keyboards);
			index++;
		});
	}

	function handleKeyboardArr(keyboards) {
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
				handleIndiKeyboard(keyboardElem, index);
				index++;
			});
		}
	}

	function handleIndiKeyboard(keyboard, index) {
		if (!keyboard_types.includes(keyboard.type)) {
			error.keyboards.push(`[ ${index} ] => Keyboards can be of only following types ${keyboard_types}`);
		}

		// if keyboard type is URL
		if (keyboard.type == 'url') {
			if (!keyboard.url) {
				error.keyboards.push([index] + ' => URL is required');
			}

			if (!keyboard.webview_size) {
				error.keyboards[index] = [index] + ' => Webview size is required.';
			}
		}

		// if keyboard type is content
		if (keyboard.type == 'content') {
			if (!keyboard._content_oid) {
				error.keyboards[index] = [index] + ' => Content OID is required';
			}
		}

		// if keyboard type is call
		if (keyboard.type == 'call') {
			if (!keyboard.phone) {
				error.keyboards.push([index] + ' => Phone number is required');
			}
		}
	}

	function handleResponseForText(textData) {
		handleContent(textData.content);
		handleKeyboardArr(textData.keyboard);
	}

	function handleResponseForImage(imageData) {
		handleContent(imageData.content);
		handleKeyboardArr(imageData.keyboard);
	}

	function handleResponseForMedia(mediaData) {
		handleContent(mediaData.content);
		handleKeyboardArr(mediaData.keyboard);
	}

	function handleResponseForList(listData) {
		handleContentsArray(listData.contents);
	}

	function handleResponseForCards(cardData) {
		handleElements(cardData);
	}

	function handleResponse() {
		if (data.type === MESSAGE_TYPES.TEXT) {
			handleResponseForText(data);
		}

		if (data.type === MESSAGE_TYPES.ATTACHMENT) {
			handleResponseForImage(data);
		}

		if (data.type === MESSAGE_TYPES.MEDIA) {
			handleResponseForMedia(data);
		}

		if (data.type === MESSAGE_TYPES.OTHER) {
			handleResponseForList(data);
		}

		if (data.type === MESSAGE_TYPES.CARDS) {
			handleResponseForCards(data.elements);
		}
		console.log(error);

		return error;
	}

	return {
		handleResponse,
	};
}
module.exports = {
	validateResponse,
};
