exports.sendSucessResponse = (msg,data)=>{
    return{
        status: 200,
        msg,
        data
    }
}

exports.methodNotAllowed = (msg)=>{
    return{
        status: 405,
        msg
    }
}

exports.validationError = (msg) =>{
    return{
        status: 609,//Custom validation Error Status Code
        type:'Validation Failed',
        msg
    }
}