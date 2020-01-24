<<<<<<< HEAD
const {
  sendSutiableHttpResponse,
} = require('../library/sendSutiableHttpResponse');

const message_types = [
  'text',
  'image',
  'video',
  'audio',
  'file',
  'cards',
  'list_item',
  'attachment'
];


const MESSAGE_TYPES = {
  TEXT : 'text'
}
const keyboard_types = [
  'url',
  'flow',
  'call',
  'share',
  'node',
  'flow',
  'content',
  'buy',
  'dynamic_block_callback'
]

const supported_images = [
  'png',
  'jpg',
  'jpeg',
]

const supported_media = [
  'mp3',
  'ogg',
  'mpeg',
  'mp4',
  'avi',
]

const mime_types = [
  'audio/mp3' || 'audio/mpeg3',
  'audio/ogg',
  'audio/mpeg',
  'validation/mpeg',
  'video/mp4',
  'video/avi',
  'video/mpeg'
]

function validateResponse(res) {
  const ValidationResponseHandler = validationResponseHandler(res);
 const error =  ValidationResponseHandler.handleResponse();
  try {
    if (res.data) {

    
      // if (!res.data.version) {
      //   return sendSutiableHttpResponse(406,res,'Version is required');
      // }
      // if (res.data.version !== 'v2') {
      //   return sendSutiableHttpResponse(406,res,'Version mismatched');
      // }

      
      // check for content 
      if(!res.data.content){
        return sendSutiableHttpResponse(406,res,'Content is required')
      }
      
      // check for message types
      const check = message_types.includes(res.data.type);
      if(!check){
        return sendSutiableHttpResponse(406,res,`Type should be one of the following ${message_types}`)
      } 


      
      // Check if data -> content -> type is image
      if (res.data.content.type == "image") {

        const validation = validateImage(res.data.content.data, res);

        if (!validation.valid) {
          return sendSutiableHttpResponse(406, res, validation.errors);
        }
      }

      // Check if data -> content -> type is audio or video
      if (res.data.content.type == "audio" || res.data.content.type == "video") {

        const validation = validateMedia(res.data.content.data, res);

        if (!validation.valid) {
          return sendSutiableHttpResponse(406, res, validation.errors);
        }
      }

      // Check if data contains button
      if(res.data.keyboard){
        if(!Array.isArray(res.data.keyboard)){
          return sendSutiableHttpResponse(406,res,'Keyboard should be of Type Array')
        }
        
        const validation = validateKeyboard(res.data.keyboard,res)

        if(!validation.valid){
          return sendSutiableHttpResponse(406,res,validation.errors)
        }
      }
    }
  } catch (err) {
    throw new Error(`Error while validating the response ${err}`);
  }
=======
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
>>>>>>> 091b3b66bd97d002f3816b40854cee8fd6675b02
}

// Buttons validation
function validateKeyboard(keyboards){
  try{
    let errors = [];
    Promise.all(keyboards.map(i=>{
      if(!keyboard_types.includes(i.type)){
        errors.push(`Keyboards can be of only following types ${keyboard_types}`)
      }

      if(!i.caption){
        errors.push(`Caption can't be empty`)
      }

      if(i.type === 'url'){
        if(!i.url){
          errors.push(`Url can't be empty in the type of URL`)
        }
      }

      if(i.type === 'call'){
        if(!i.phone){
          errors.push(`Phone can't be empty in the type call`)
        }
      }

    }))
    if(errors.length>0){
    return {
      valid: false,
      errors
    }
  }
  return {
    valid: true
  }
  }
  catch(err){
    throw new Error(`Error while validating Button ${err}`)
  }
}

// Image Validation
function validateImage(image){
  try{
    let errors = []
    
    if(message_types.includes(image.type)){
      errors.push(`Images can be of only following types ${message_types}`)
    }
    
    if(!supported_images.includes(image.img_big.split('.').pop() && image.img_big.split('.').pop())){
      errors.push(`The file extension for image must be the following types ${ supported_images }.`);
    }

    if(image.title){
      errors.push('The title of the image is required.');
    }

    if (!(image.img_small && image.img_big)) {
      errors.push('Both small and big images are required.');
    }
    
    if (errors.length>0){
      return {
        valid: false,
        errors
      }
    }

    return {
      valid: true
    }
  }
  catch (err) {
    throw new Error(`Error while validating Images ${err}`)
  }
}

// Audio/Video Validation
function validateMedia(media) {
  try {
    let errors = [];

    if (media.type != "file") {
      errors.push('The media format must be file');
    }

    if(!mime_types.includes(media.mime)) {
      errors.push(`Media files must be the following types ${ mime_types }.`)
    }

    if (!supported_media.includes(media.file.split('.').pop())) {
      errors.push(`Media files must be the following types ${ supported_media }.`);
    }

    if (!media.title) {
      errors.push('The title for the media file is required.');
    }

    if (errors.length>0){
      return {
        valid: false,
        errors
      }
    }

    return {
      valid: true
    }

  } catch (err) {
    throw new Error(`Error while validating Media ${err}`)
  }
}



function validationResponseHandler (res){
  const {data} = res;
  const error = {};

  function handleContentDataForiamge(){
    //
  }
  function handleContentData(contentData){
    if(contentData.type === 'image'){
      //handle content data for image 
    }
    if(contentData.type ==' videos') {
    }
  }

  function handleContent(content){
    if(!content.text){
      error.content = 'Content is required !';
    }

    if(content.text) {
      if(!content.text.value){
        error.content = {};
        error.content.value = 'value is required !';
      }
    }

    if(content.data){
      handleContentData();
    }
  }

  function handleKeyboardArr(keyboards){
    if(keyboards && keyboards.length > 3){
      error.keyboards = 'you have more keyboard';
    }
    if(keyboards && keyboards.length < 3){
      index = 0;
      keyboards.forEach(keyboardElem => {
          handleIndiKeyboard(keyboardElem, index);
          index ++;
      });
    }
  }

  function handleIndiKeyboard(keyboard, index){
    if(keyboard.type == 'url'){
      if(!keyboard.url) {
        error.keyboards = [];
        error.keyboards[2] = 'url is required';
      }
    }
  } 


  function handleResponseForText(textData){
    handleContent(textData.content);
    handleKeyboardArr(textData.keyboard);
  }


  function handleResponse(){
    if(data.type === MESSAGE_TYPES.TEXT){
      handleResponseForText(data);
    }
  
    if(data.type=== 'cards'){
      handleResponseForCards(data);
   
    }
    console.log(error)
    return error;
  }

  return {
    handleResponse
  }
  
}
module.exports = {
<<<<<<< HEAD
  validateResponse,
=======
	validateResponse,
>>>>>>> 091b3b66bd97d002f3816b40854cee8fd6675b02
};
