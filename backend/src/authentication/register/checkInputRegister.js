var regexPassword = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
const validator = require("email-validator");
function checkFullInput(req, res) {
  if (
    req.body.email === "" ||
    req.body.password === "" ||
    req.body.firstName === "" ||
    req.body.lastName === "" ||
    req.body.address === "" ||
    !req.file ||
    req.body.phoneNumber === ""
  ) {
    res.send({ Error: "Missing Inputs" });
    return false;
  }
  if (!validator.validate(req.body.email)) {
    res.send({ Error: "email is not valid" });
    return false;
  }
  if (!regexPassword.test(req.body.password.toString())) {
    res.json({
      Error: "password is not in the right format",
    });
    return false;
  }

  return true;
}

module.exports = checkFullInput;
