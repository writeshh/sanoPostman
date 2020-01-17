const StatusCode = require('./statusCodes');

function sendSutiableHttpResponse(code,msg,data){
    try{
        if(code === 200){
            return StatusCode.sendSucessResponse(msg,data)
        }
        if(code === 405){
            return StatusCode.methodNotAllowed(msg)
        }
        if(code === 609){
            return StatusCode.validationError(msg)
        }
        if(code === 401){
            return StatusCode.unauthorizedUser(msg)
        }
        if(code === 403){
            return StatusCode.forbidden(msg,data)
        }
        if(code === 404){
            return StatusCode.notFound(msg)
        }
        if(code === 201){
            return StatusCode.created(msg)
        }
        if(![200,405,609,401,403,404,201].includes(code)){
            return{
                status: code,
                msg,
                data
            }

        }
    }
    catch(err){
        throw new Error(`Error while sending sutiable error response ${err}`)
    }
}

module.exports = {
    sendSutiableHttpResponse
}