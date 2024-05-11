const Joi = require("joi");


const updateRoomSchema = Joi.object({
  startDate: Joi.date().min("now").required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
});

module.exports = updateRoomSchema;
