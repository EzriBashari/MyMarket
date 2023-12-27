const db = require("../../dbConnection");

async function removeFromCart(req, res) {
  const productId = req.body.productNumber;
  const q = "DELETE FROM addproduct WHERE productNumber = ?";

  db.query(q, [productId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product deleted successfully");
  });
}
module.exports = removeFromCart;
