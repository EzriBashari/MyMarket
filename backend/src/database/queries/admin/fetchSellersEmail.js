
const db = require("../../dbConnection");

async function fetchSellersEmail(req, res) {
  const q = "SELECT * FROM usertable WHERE role = 'seller' AND isAdmin = 0";
  db.query(q, req.body.tax, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
}
module.exports = fetchSellersEmail;
