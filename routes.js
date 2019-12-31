const {Router} = require('express');
const {sanoPostman} = require('./apiExecutor');
const router = Router();

router.use('/sanoPostman', async(req,res)=>{
const {method, body:{url}, headers, body, query} = req;
if(!url){
    throw new Error(`Url is required for making request`)
}
const request = {};  

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
return res.json(ree)
})

module.exports = router