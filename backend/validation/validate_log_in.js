const Validator = require("validator");
const is_empty = require("is-empty");

module.exports = function validateLoginInput(data){
    let errors = {};
    data.email = !is_empty(data.email) ? String(data.email) :"";
    data.password = !is_empty(data.password) ? String(data.password):"";
    if(Validator.isEmpty(data.email)){
        errors.email="email field is required";
    }
    else if(!Validator.isEmail(data.email)){
        errors.email = "email is invalid";
    }
    if(Validator.isEmpty(data.password)){
        errors.password="Password field is required";
    }
    return {
        errors,
        isValid:is_empty(errors)
    };
};