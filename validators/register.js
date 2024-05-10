const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")),
  accountName: Joi.string().alphanum().required(),
  accountNumber: Joi.string().length(10).required(),
  accountBank: Joi.string().alphanum().min(3).max(30).required(),
});

module.exports = registerSchema;
