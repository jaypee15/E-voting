const Joi = require("joi");

const voteSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  amount: Joi.number().integer().positive().min(50).required(),
});

module.exports = voteSchema;
