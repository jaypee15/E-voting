const Joi = require("joi");


const updateRoomSchema = Joi.object({
  startDate: Joi.date(),
  endDate: Joi.date().greater(Joi.ref("startDate")),
});

module.exports = updateRoomSchema;
