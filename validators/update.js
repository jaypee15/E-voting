const Joi = require("joi");

updateSchema = Joi.oject({
  currentPassword: Joi.string().min(8).required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = updateSchema;
