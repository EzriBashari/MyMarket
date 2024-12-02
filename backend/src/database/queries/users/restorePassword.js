const nodemailer = require("nodemailer");
const db = require("../../dbConnection");
const bcrypt = require("bcrypt");
const saltRounds = 10;
async function getPassword(req, res) {
  if (req.body.email === "") {
     return res.json({ Error: "Enter your email" });
  }
  const userEmail = req.body.email;

  const q = "SELECT * FROM usertable WHERE email = ?";
  db.query(q, [userEmail], (err, data) => {
    if (err) {
      console.error("ERROR");
      return res.json({ Error: "Server error" });
    }
    if (data.length > 0) {
      let password = null;
      password = generateRandomPassword();
      restorePassword(req, res, password);
      const q = "UPDATE `usertable` SET `password`= ? WHERE `email` = ?";
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) return res.json({ Error: "server error" });
          db.query(q, [hash, req.body.email], (err, data) => {
            if (err) return res.json(err);
            return res.json({ Status: "Success" });
          });
        });
      });

    } else {
      return res.json({ Error: "User does not exist" });
    }
  });
}
async function restorePassword(req, res, password) {
  console.log(password);
  if (password != null) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "comp47207@pet.ac.il",
        pass: "207324229",
      },
    });

    var mailOptions = {
      from: "comp47207@pet.ac.il",
      to: "ezbishari@gmail.com",
      subject: "passwors reset",
      text: password,
    };
    console.log("this is the password" + password);
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: ");
      }
    });
  }
}

function generateRandomPassword() {
  const length = 10; // Change the length as per your requirement
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  // Generate the password with at least one upper case, one lower case, and one number
  password += getRandomCharacter("abcdefghijklmnopqrstuvwxyz");
  password += getRandomCharacter("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  password += getRandomCharacter("0123456789");

  while (password.length < length) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  // Shuffle the generated characters to make it random
  password = shuffleString(password);

  return password;
}

// Function to get a random character from a given string
function getRandomCharacter(str) {
  const randomIndex = Math.floor(Math.random() * str.length);
  return str[randomIndex];
}

// Function to shuffle the characters of a string
function shuffleString(str) {
  let shuffledString = "";
  const arr = str.split("");
  while (arr.length > 0) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    shuffledString += arr.splice(randomIndex, 1)[0];
  }
  return shuffledString;
}

module.exports = getPassword;
