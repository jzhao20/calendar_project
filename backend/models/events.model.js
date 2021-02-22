const mongoose = require('mongoose');

const {Schema} = mongoose;

const event_schema = new Schema({
    event_name:{type:String},
    event_category:{type:String},
    date:{type:Date},
    aux:{type:Number}
});

const event = mongoose.model('event',event_schema);
module.exports = event;