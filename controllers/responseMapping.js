/**
 * Response Mapping should be seperate API 
 * This API should accept the value form the Keys which should be dynamic and depending on the response of the API
 */

 async function responseMapper(keys,response){
     try{
        return response[keys]
     } catch(err){
         throw new Error(`Error while mapping response from the key ${err}`)
     }
 }

 module.exports = {
     responseMapper
 }