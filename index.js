const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.urlencoded({extended: true}));
app.use(cors())
app.use(express.json());
app.use('/', require('./routes/routes'))

app.listen(4000)

module.exports = {
    app
}