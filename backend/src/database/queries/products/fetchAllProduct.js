const db = require("../../dbConnection");

async function fetchAllProducts(req, res) {
  const q = "SELECT * FROM product WHERE `status` = 0 AND amount > 0";
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
}

module.exports = fetchAllProducts;
