const db = require("../../dbConnection");

async function setTax(req, res) {
  const q = "SELECT * FROM `tax` WHERE 1";
  db.query(q, req.body.tax, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
}
module.exports = setTax;
