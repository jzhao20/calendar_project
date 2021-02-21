const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;
const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        minlength:3
    },
    password:
    {
        type:String,
        required:true,
        minlength:3
    },
    events:[ObjectId]
},{
    timestamps:true,
});
const users = mongoose.model('users',userSchema)

module.exports = users;