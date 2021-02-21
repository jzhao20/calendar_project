const mongoose = require('mongoose');

const {Schema} = mongoose;

const i_event_schema = new Schema({
    name:{type:String},
    date:{type:Date},
});
const event_schema = new Schema({
    event_name:{type:String},
    event:[i_event_schema],
});

const event = mongoose.model('event',event_schema);
module.exports = event;