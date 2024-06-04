const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required(),
  contestants: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      username: Joi.string().alphanum().required()
    })
  ),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required()
});

module.exports = schema;
