exports.sendSucessResponse = (data)=>{
    return{
        status: 200,
        type: 'Sucess',
        data
    }
}

exports.methodNotAllowed = (msg)=>{
    return{
        status: 405,
        type:'Message Not Allowded',
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

exports.unauthorizedUser = (msg)=>{
    return{
        status: 401,
        type: 'Authorization Error',
        msg
    }
}

exports.forbidden = (msg,data)=>{
    return{
        status: 403,
        type: 'Forbidden',
        msg,
        data
    }
}

exports.notFound = (msg)=>{
    return{
        status: 404,
        type: 'Not Found',
        msg
    }
}

exports.created = (msg)=>{
    return{
        status: 201,
        type: 'Created',
        msg
    }
}