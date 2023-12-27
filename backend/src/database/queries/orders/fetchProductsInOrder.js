const db = require("../../dbConnection");

async function fetchProductsInOrder(req, res) {
  const q =
    "SELECT product.*, includes.amount as buyAmount, includes.orderStatus, userTable.firstName as sellerName FROM product INNER JOIN includes ON product.productNumber = includes.productNumber INNER JOIN userTable ON product.ID = userTable.ID WHERE includes.orderNumber = ?";
  db.query(q, req.body.orderNumber, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
}

module.exports = fetchProductsInOrder;
