const db = require("../../dbConnection");

async function deleteProduct(req, res) {
  const productId = req.params.productNumber;
  const q = "UPDATE `product` SET `status` = 1 WHERE productNumber = ?";

  db.query(q, [productId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product disabled successfully");
  });
}

module.exports = deleteProduct;
