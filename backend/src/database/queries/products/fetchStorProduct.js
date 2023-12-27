const db = require("../../dbConnection");

async function fetchAllProducts(req, res) {
  const productId = req.params.productId;
  const q = "SELECT `ID` FROM product WHERE `productNumber` = ?";
  db.query(q,[productId], (err, data) => {
    if (err) {
      return res.json(err);
    }
    const q = "SELECT * FROM product WHERE `status` = 0 AND `ID` = ? AND amount > 0 ";
    db.query(q,[data[0].ID], (err, data) => {
      if (err) {
        return res.json(err);
      }
      return res.json(data);
    });
  });
}

module.exports = fetchAllProducts;
