const db = require("../../dbConnection");
const bcrypt = require("bcrypt");

//const jwt = require("jsonwebtoken");

async function login(req, res) {
  if (req.body.email === "" || req.body.password === "") {
    return res.json({ Error: "Missing Inputs" });
  }
  const q = "SELECT * FROM usertable WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login Error from server" });
    if (data.length > 0) {
      bcrypt.compare(req.body.password, data[0].password, (err, response) => {
        if (err) return res.json({ Error: "password compare error" });
        if (response) {
           const logQ =
             "INSERT INTO entry_log (userID, action, details) VALUES (?)";
           const logValuesQ = [
             data[0].ID,
             "User login",
             "User loged in to our website",
           ];
           db.query(logQ, [logValuesQ], (err) => {
             if (err) {
               console.log(err);
             }
           });
          return res.json({
            Status: "Success",
            userID: data[0].ID,
            isAdmin: data[0].isAdmin,
            role: data[0].role,
          });
        } else {
          return res.json({ Error: "password is not correct" });
        }
      });
    } else {
      return res.json({ Error: "this email not exsists" });
    }
  });
}
module.exports = login;
