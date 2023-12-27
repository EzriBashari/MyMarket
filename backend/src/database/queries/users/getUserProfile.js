
const db = require("../../dbConnection");
async function getUserProfile(req, res){
  const userID = req.params.userID.split(":")[1];
  const q = "SELECT * FROM `usertable` WHERE ID = ?";
  db.query(q, [userID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
}

module.exports = getUserProfile;