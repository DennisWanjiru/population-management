const express = require("express")
const app =  express()
const locationRouter = require("./routes/locations")
const {PORT,MLAB_URI} = process.env
const  mongoose =  require('mongoose');
const bodyParser = require("body-parser")
const morgan = require('morgan')

const db = mongoose.connect(MLAB_URI);
app.use(morgan('combined'))
app.use(bodyParser.json())

app.use('/api/locations', locationRouter)

app.listen(PORT,()=>{
    console.log('the app is running at ', PORT)
})

