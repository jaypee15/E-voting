const Joi = require("joi");

const votingRoomSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
  contestants: Joi.string().min(8).max(30).required(),
});

module.exports = votingRoomSchema;
