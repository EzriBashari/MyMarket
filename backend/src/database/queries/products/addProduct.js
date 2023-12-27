const db = require("../../dbConnection");
async function addProduct(req, res) {
  if (
    req.body.name === "" ||
    req.body.description === "" ||
    req.body.price === "" ||
    !req.file ||
    req.body.amount === "" ||
    req.body.CategoryID === null
  )
    return res.json({
      Error: "missing input",
    });
  const q =
    "INSERT INTO `product`(`productNumber`, `price`, `name`, `amount`, `CategoryID`, `ID`, `image`, `description`, `status`) VALUES (?)";
  const values = [
    req.body.productNumber,
    req.body.price,
    req.body.name,
    req.body.amount,
    req.body.CategoryID,
    req.body.SellerID,
    req.file.filename,
    req.body.description,
    0,
  ];

  
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json({
      Status: "Success",
    });
  });
}
module.exports = addProduct;
