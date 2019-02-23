const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const locationModel = new Schema({
    name: {type:String},
    females: { type: Number   },
    males: { type: Number },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'locations' },
})
module.exports =  mongoose.model('locations', locationModel)