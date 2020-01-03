const {Router} = require('express');
const {sanoPostman} = require('../controllers/apiExecutor');
const {responseMapper} = require('../controllers/responseMapping');
const router = Router();

router.use('/sanoPostman', async(req,res)=>{
const {body:{url, keys, method}, headers, headers:{authorization}, body, query} = req;
if(!url){
    throw new Error(`Url is required for making request`)
}

if(!method){
    throw new Error(`Method is required for making request`)
}
const request = {};  

if(authorization){
    request.auth = authorization;
}

if(headers){
    request.headers = headers
}

if(query){
    request.query = query
}

if(body){
    request.body = body;
}
const ree = await sanoPostman(method,url,request);
const check = await responseMapper(keys, ree);
return res.json(ree)
})

module.exports = router