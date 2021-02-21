const Validator = require("validator");
const is_empty = require("is-empty");

module.exports = function validateLoginInput(data){
    let errors = {};
    data.email = !is_empty(data.username) ? data.username :"";
    data.password = !is_empty(data.password) ? data.password:"";
    if(Validator.is_empty(data.email)){
        errors.email="username field is required";
    }
    else if(!Validator.isEmail(data.username)){
        errors.email = "username is invalid";
    }
    if(Validator.is_empty(data.password)){
        errors.password="Password field is required";
    }
    return {
        errors,
        isValid:is_empty(errors)
    };
};