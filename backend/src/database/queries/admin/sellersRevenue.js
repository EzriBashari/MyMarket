const db = require("../../dbConnection");

async function sellersRevenue(req, res) {
  const q =
    "SELECT u.ID AS seller_id, u.firstName AS seller_firstName, u.lastName AS seller_lastName,COUNT(DISTINCT i.productNumber) AS total_products, SUM(i.amount * p.price) AS total_revenue FROM includes i JOIN product p ON i.productNumber = p.productNumber JOIN usertable u ON i.sellerId = u.ID GROUP BY u.ID ORDER BY seller_id LIMIT 5";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.send(data);
  });
}
module.exports = sellersRevenue;
