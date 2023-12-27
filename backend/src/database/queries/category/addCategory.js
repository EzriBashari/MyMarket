const db = require("../../dbConnection");
async function addCategory(req, res) {
  const q = "INSERT INTO `category`(`CategoryID`, `Name`) VALUES (?)";
  const values = [req.body.CategoryID, req.body.name];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
}

async function deleteCategory(req, res) {
  const categoryID = req.params.id;
  const q = "DELETE FROM `category` WHERE `CategoryID` = ?";
  db.query(q, [categoryID], (err, data) => {
    if (err) return res.json({Error:"Category is in use"});
    return res.json(data);
  });
}

module.exports = {
  addCategory,
  deleteCategory,
};
