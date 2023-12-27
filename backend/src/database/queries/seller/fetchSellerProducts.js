const db = require("../../dbConnection");

async function fetchSellerProducts(req, res) {
  
  const q =
    "SELECT * ,(SELECT SUM(includes.amount) FROM includes WHERE includes.productNumber = product.productNumber) as orderedItemCount FROM product WHERE `status` = 0 AND `ID` = ?";
  const sellerId = req.params.sellerId.split(":")[1]
  db.query(q , [sellerId], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    
    return res.json(data);
  });
  
}

module.exports = fetchSellerProducts;
