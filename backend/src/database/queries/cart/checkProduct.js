const db = require("../../dbConnection");

async function checkProduct(req, res) {
  const q = "UPDATE `addProduct` SET `isChecked` = ? where productNumber = ?";
  const checked = req.body.status === 0? 1 :0;
  const values = [checked, req.body.productNumber];
  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json({ Success: "good" });
  });
}
module.exports = checkProduct;
