const axios = require('axios');
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
            return sendSutiableHttpResponse(response.status,response.data)
            }
            catch(err){
                if(err.response){
                    return sendSutiableHttpResponse(err.response.status,err.message)
                }
                return sendSutiableHttpResponse(404,err)
            }
        }
        if(method === 'POST'){
            try{
            const response = await axios.post(url, body,config );
            return sendSutiableHttpResponse(response.status,response.data)
            }
            catch(err){
                if(err.response){
                return sendSutiableHttpResponse(err.response.status,err.message)
                }
                return sendSutiableHttpResponse(404,err)
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