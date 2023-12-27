const db = require("../../dbConnection");

async function displayCart(req, res) {
  const q =
    "SELECT p.*, ap.amount as cartAmount, ap.isChecked as checked FROM addproduct ap JOIN product p ON ap.productNumber = p.productNumber JOIN cart c ON ap.cartId = c.cartId WHERE c.userID = ?";
  db.query(q, [req.params.userID.split(":")[1]], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
}
module.exports = displayCart;
