const db = require("../../dbConnection");
async function fetchSellerSales(req, res) {
  const q =
    "SELECT includes.*, orders.dateOfOrder, orders.buyerID, userTable.address FROM includes INNER JOIN orders ON orders.orderNumber = includes.orderNumber INNER JOIN userTable ON orders.buyerID = userTable.ID WHERE sellerId = ?";

  const sellerId = req.params.sellerId.split(":")[1];
  db.query(q, [sellerId], (err, data) => {
    if (err) {
      return res.json(err);
    }
    return res.json(data);
  });
}

module.exports = fetchSellerSales;
