const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).max(30).required(),
});

module.exports = loginSchema;
