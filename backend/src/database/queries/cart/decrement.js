const db = require("../../dbConnection");

async function decrement(req, res) {
  const q = "UPDATE `addProduct` SET `amount` = ? where productNumber = ?";
  const values = [req.body.amount, req.body.productNumber];
  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.json({ Success: "good" });
  });
}
module.exports = decrement;
