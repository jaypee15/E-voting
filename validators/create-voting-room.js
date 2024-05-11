const Joi = require("joi");

const contestantSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string(),
  username: Joi.string().required(),
});

const votingRoomSchema = Joi.object({
  name: Joi.string().required().trim().min(5).max(50),
  contestants: Joi.array().items(contestantSchema).required(),
  startDate: Joi.date().min("now").required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
});

module.exports = votingRoomSchema;
