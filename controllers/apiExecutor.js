const axios = require('axios');
const qs = require('querystring');
const StatusCode = require('../library/statusCodes');

async function sanoPostman(method, url,request){
    try{
        const {headers, body, query} = request;
        const config = {};
        if(Object.keys(query).length>0){
            config.params = query
        }
        // config.headers = {
        //     'Authorization': request.auth
        // }
        if(method === 'GET'){
            try{
            const response = await axios.get(url,config);
            return StatusCode.sendSucessResponse('Sucess',response.data)
            }
            catch(err){
                return StatusCode.methodNotAllowed(`Get Method not allowed ${err}`)
            }
        }
        if(method === 'POST'){
            try{
            const response = await axios.post(url, qs.stringify(body),config );
            return response.data;
            }
            catch(err){
                return StatusCode.methodNotAllowed(`Post Method not allowed ${err}`)
            }
        }
    }
    catch(err){
        throw new Error(`Error while creating sano Post Man ${err}`)
    }
}

module.exports = {
    sanoPostman
}