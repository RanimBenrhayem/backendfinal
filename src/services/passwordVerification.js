const joi = require("joi");

const schema = joi.object({
  password: joi.string().min(5).alphanum(),
});
async function validatePassword(password) {
  try {
    await schema.validateAsync(password);
    return { success: true, msg: "password is valid" };
  } catch (error) {
    return { success: false, msg: error.toString() };
  }
}
module.exports = validatePassword;