const Validator = require("validator");
const is_empty = require("is-empty");
module.exports = function validateLoginInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.email = !is_empty(data.email) ? data.email : "";
  data.password = !is_empty(data.password) ? data.password : "";
// email checks
  if (Validator.is_empty(data.email)) {
    errors.email = "username field is required";
  } else if (!Validator.isEmail(data.username)) {
    errors.email = "username is invalid";
  }
// Password checks
  if (Validator.is_empty(data.password)) {
    errors.password = "Password field is required";
  }
return {
    errors,
    isValid: is_empty(errors)
  };
};