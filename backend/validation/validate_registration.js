const Validator = require("validator");
const is_empty = require("is-empty");
module.exports = function validateLoginInput(data) {
  let errors = {};
// Convert empty fields to an empty string so we can use validator functions
  data.email = !is_empty(data.email) ? String(data.email) : "";
  data.password = !is_empty(data.password) ? String(data.password) : "";
// email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "username field is required";
  }
// Password checks
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }
return {
    errors,
    isValid: is_empty(errors)
  };
};