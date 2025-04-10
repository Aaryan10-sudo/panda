const Joi = require("joi");

const userSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string(),
  address: Joi.array().items(
    Joi.object({
      country: Joi.string().required(),
      city: Joi.string().required(),
      street: Joi.string().required(),
      zip: Joi.string().required(),
    }).required()
  ),
});

function validateUser(req, res, next) {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
}

module.exports = validateUser;
