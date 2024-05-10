const Joi = require("joi");

const Validators = require("../validators");
const ErrorObject = require("../utils/error");

module.exports = function (validator) {
  console.log("from validator middleware:", validator);

  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].validateAsync(req.body);
      validated["validate"]="true";
      req.body = validated;
    // req.body = {"role": "test"}
    // 
      next();
    } catch (error) {
      console.log("from catch:", error);
      if (error.isJoi) return next(new ErrorObject(error, 422));

      next(new ErrorObject("not joi: error", 500));
    }
  };
};
