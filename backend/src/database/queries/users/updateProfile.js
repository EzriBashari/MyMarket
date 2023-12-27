const db = require("../../dbConnection");

async function updateProfile(req, res) {
  if(!checkFullInput(req, res)){
    return res.json({ Error: "Missing Inputs" });;
  }
  let q =
    "UPDATE `usertable` SET `firstName`= ? ,`lastName`=?,`address`=?,`phoneNumber`=?,`image`=? WHERE `email` = ?";
  let values = [
    req.body.firstName,
    req.body.lastName,
    req.body.address,
    req.body.phoneNumber,
    req.file ? req.file.filename : null,
    req.body.email,
  ];
  if (req.file === undefined) {
    q =
      "UPDATE `usertable` SET `firstName`= ? ,`lastName`=?,`address`=?,`phoneNumber`=? WHERE `email` = ?";
      values = [
        req.body.firstName,
        req.body.lastName,
        req.body.address,
        req.body.phoneNumber,
        req.body.email,
      ];
  }

  db.query(q, values, (err, data) => {
    if (err) {
      return res.json(err);
    }

    return res.json({Status:"Success"}); 
  });
}

var regexImage = /\.(gif|jpg|jpeg|tiff|png)$/i;

function checkFullInput(req, res) {
  if (
    req.body.firstName === "" ||
    req.body.lastName === "" ||
    req.body.address === "" ||
    req.body.phoneNumber === ""
  ) {
    
    return false;
  }
  return true;
}

module.exports = updateProfile;
