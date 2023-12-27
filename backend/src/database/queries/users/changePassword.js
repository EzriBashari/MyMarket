const db = require("../../dbConnection");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function changePassword(req, res) {
  if (
    req.body.firstPassword === "" ||
    req.body.secondPassword === "" ||
    req.body.newPassword === ""
  ) {
    return res.json({ Error: "missing input" });
  }
  if (req.body.firstPassword !== req.body.secondPassword) {
    return res.json({ Error: "passwords not match" });
  }
  const q = "SELECT `password` FROM usertable WHERE ID = ?";

  db.query(q, [req.body.userID], (err, data) => {
    if (err) return res.json({ Error: "Error from server" });
    if (data.length > 0) {
      bcrypt.compare(req.body.firstPassword, data[0].password, (err, response) => {
        if (err) return res.json({ Error: "password is not correct" });
        const q = "UPDATE `usertable` SET `password`= ? WHERE `ID` = ?";

        const password = req.body.newPassword.toString();
        bcrypt.genSalt(saltRounds, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            // Store hash in your password DB.
            if (err) return res.json({ Error: "error for hashing" });

            db.query(q, [hash, req.body.userID], (err, data) => {
              if (err) return res.json(err);
              return res.json({ Status: "Success" });
            });
          });
        });
      });
    }
  });
}

module.exports = changePassword;
