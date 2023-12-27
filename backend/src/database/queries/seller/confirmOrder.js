const db = require("../../dbConnection");

async function confirmOrder(req, res) {
  const q =
    "UPDATE `includes` SET `orderStatus`= ? WHERE `productNumber`= ? AND `orderNumber` = ?";
  const values = [
    "confirmed",
    req.body.productNumber,
    req.body.orderId
  ]
  db.query(q, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }

    return res.json(data);
  });
}

module.exports = confirmOrder;
