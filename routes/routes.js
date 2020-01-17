const {Router} = require('express');
const {sanoPostman} = require('../controllers/apiExecutor');
const {validateResponse} = require('../validations/responseValidator');
const router = Router();

router.use('/sanoPostman', async(req,res)=>{
const {body:{url}, headers, method, body, query} = req;
if(!url){
    throw new Error(`Url is required for making request`)
}

if(!method){
    throw new Error(`Method is required for making request`)
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
const check = validateResponse(ree)
if(check){
if(check.status === 609){
    return res.json(check)
}
}

if(ree.status === 200){
    return res.json(ree)
}


return res.status(ree.status).json(ree.msg)
})

module.exports = router