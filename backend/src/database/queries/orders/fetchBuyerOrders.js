const db = require("../../dbConnection");

async function fetchBuyerOrders(req, res) {
  const q = "SELECT * FROM orders WHERE `buyerID` = ?";
  db.query(q,req.params.userID,  (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
}

module.exports = fetchBuyerOrders;
