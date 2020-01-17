const axios = require('axios');
const qs = require('querystring');
const {sendSutiableHttpResponse} = require('../library/sendSutiableHttpResponse');

async function sanoPostman(method, url,request){
    try{
        const {headers, body, query} = request;
        const config = {};
        if(Object.keys(query).length>0){
            config.params = query
        }
        delete headers.host;
        delete headers.cookie;
        delete headers.connection;
        delete headers['user-agent'];
        delete headers['postman-token'];
        delete headers['content-length'];
        delete headers['accept-encoding'];
        delete headers['cache-control'];
        config.headers = {
             ... headers
        }
        if(method === 'GET'){
            try{
            const response = await axios.get(url,config);
            return sendSutiableHttpResponse(200,'Sucess',response.data)
            }
            catch(err){
               return sendSutiableHttpResponse(err.response.status,err.message)
            }
        }
        if(method === 'POST'){
            try{
            const response = await axios.post(url, qs.stringify(body),config );
            return StatusCode.sendSucessResponse('Sucess',response.data)
            }
            catch(err){
                return sendSutiableHttpResponse(err.response.status,err.message)
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