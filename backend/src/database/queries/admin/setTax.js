const db = require("../../dbConnection");

async function setTax(req, res) {
  const q = "UPDATE `tax` SET `tax_price`= ? WHERE 1";
  db.query(q, req.body.tax, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
}
module.exports = setTax;
