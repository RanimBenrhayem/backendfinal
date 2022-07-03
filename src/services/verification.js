const userModel = require("../models/user.model");
const joi = require("joi");

const schema = joi.object({
  firstName: joi.string().min(3).required("Firstname is required").pattern(new RegExp("^[a-zA-Z ]*$")),
  lastName: joi.string().min(3).required("Lastname is required").pattern(new RegExp("^[a-zA-Z ]*$")),
  password: joi.string().min(5).required("password is required").alphanum(),
  email: joi.string().email().required("email is required"),
  phoneNumber: joi
    .string()
    .length(8)
    .required("phoneNumber is required")
    .pattern(new RegExp("^[0-9]{8}$")),
});

async function validate(user) {
  try {
    await schema.validateAsync(user);
    return { success: true, msg: "user is valid" };
  } catch (error) {
    return { success: false, msg: error.toString() };
  }
}

module.exports = validate;
