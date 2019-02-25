const express = require("express")
const app =  express()
const locationRouter = require("./routes/locations")
const {PORT,MLAB_URI} = process.env
const  mongoose =  require('mongoose');
const bodyParser = require("body-parser")
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express');
const db = mongoose.connect(MLAB_URI);
const swaggerDocument = require('./swagger.json');
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/locations', locationRouter)

app.listen(PORT,()=>{
    console.log('the app is running at ', PORT)
})


module.exports = app
