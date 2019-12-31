const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/', require('./routes/routes'))

app.use('/test',(req,res)=>{
    res.json({
        msg: 'Hello'
    })
})

app.listen(3000)

module.exports = {
    app
}