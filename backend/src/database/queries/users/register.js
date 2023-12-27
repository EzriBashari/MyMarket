const db = require("../../dbConnection");
const checkFullInput = require("../../../authentication/register/checkInputRegister");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function register(req, res) {
  if (!checkFullInput(req, res)) {
    return;
  }
  const checkEmailExists =
    "SELECT COUNT(*) AS email_count FROM usertable WHERE email = ?";
  db.query(checkEmailExists, req.body.email, (err, data) => {
    if (err) {
      return res.json(err);
    }

    if (data[0].email_count === 0) {
      const q =
        "INSERT INTO `usertable`(`ID`, `email`, `password`, `FirstName`, `lastName`, `address`, `role`, `isAdmin`, `phoneNumber`, `status`, `image`) VALUES (?)";

      const password = req.body.password.toString();
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            return res.json({ Error: "error for hashing" });
          }

          const values = [
            req.body.ID,
            req.body.email,
            hash,
            req.body.firstName,
            req.body.lastName,
            req.body.address,
            req.body.role,
            req.body.isAdmin,
            req.body.phoneNumber,
            req.body.status,
            req.file.filename,
          ];

          db.query(q, [values], (err, userData) => {
            if (err) {
              return res.json(err);
            }
            const getID = "SELECT `ID` from `usertable` WHERE `email` = ? ";
            db.query(getID, [req.body.email], (err, fetchedID) => {
              if (err) {
                return res.json(err);
              }
              const insertCartQuery =
                "INSERT INTO `cart`(`cartId`, `userID`) VALUES (?)";
              const cartValues = [
                fetchedID[0].ID + new Date().getFullYear(),
                fetchedID[0].ID,
              ];
              db.query(insertCartQuery, [cartValues], (err, cartData) => {
                if (err) {
                  console.log(err);
                  return res.json(err);
                }

                const logQ =
                  "INSERT INTO entry_log (userID, action, details) VALUES (?)";
                const logValuesQ = [
                  getID,
                  "User login",
                  "User loged in to our website",
                ];
                db.query(logQ, [logValuesQ], (err) => {
                  if (err) {
                    console.log(err);
                  }
                });

                return res.json(userData);
              });
            });
          });
        });
      });
    } else {
      res.json({ Error: "This email is already in use." });
    }
  });
}

module.exports = register;
