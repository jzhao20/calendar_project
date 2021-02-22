
const mongoose = require('mongoose');

const {Schema} = mongoose;

const event_type_schema = new Schema({
    events :{type:[String]}
});

const event_type = mongoose.model('event_types',event_type_schema);
module.exports = event_type;