const db = require("../../dbConnection");

async function updateProduct(req, res) {
  if (req.body.price === "" ||
    req.body.name=== "" ||
    req.body.amount=== "" ||
    req.body.CategoryID=== "" ||
    req.body.description=== "" ) {
      return res.json({Error:"missing input"})
    
  }

  const productId = req.body.productNumber;
  let q =
    "UPDATE `product` SET `price`=?,`name`=?,`amount`=?,`CategoryID`=?,`image`=?, `description`=? WHERE productNumber = ?";
  let values = [
    req.body.price,
    req.body.name,
    req.body.amount,
    req.body.CategoryID,
    req.file ? req.file.filename : null,
    req.body.description,
  ];
  if (req.file === undefined) {
    q =
      "UPDATE `product` SET `price`=?,`name`=?,`amount`=?,`CategoryID`=?, `description`=? WHERE productNumber = ?";
    values = [
      req.body.price,
      req.body.name,
      req.body.amount,
      req.body.CategoryID,
      req.body.description,
    ];
  }
  db.query(q, [...values, productId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product updated successfully");
  });
}

module.exports = updateProduct;
