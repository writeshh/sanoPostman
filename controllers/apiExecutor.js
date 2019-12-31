const axios = require('axios');
const qs = require('querystring');

async function sanoPostman(method, url,request){
    try{
        const {headers, body, query} = request;
        const config = {};
        if(Object.keys(query).length>0){
            config.params = query
        }
        config.headers = {
            'Authorization': request.auth
        }
        if(method === 'GET'){
            const response = await axios.get(url,config);
            return response.data;
        }
        if(method === 'POST'){
            const response = await axios.post(url, qs.stringify(body),config );
            return response.data;
        }
    }
    catch(err){
        throw new Error(`Error while creating sano Post Man ${err}`)
    }
}

module.exports = {
    sanoPostman
}