const axios = require('axios');
const qs = require('querystring');

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
            return response.data;
            }
            catch(err){
                return {
                    status: 405,
                    msg: `Get Method not allowed ${err}`
                }
            }
        }
        if(method === 'POST'){
            try{
            const response = await axios.post(url, qs.stringify(body),config );
            return response.data;
            }
            catch(err){
                return {
                    status: 405,
                    msg: `Post Method not allowed ${err}`
                }
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