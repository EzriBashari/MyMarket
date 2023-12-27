const db = require("../../dbConnection");

async function usersEnterys(req, res) {
  const q =
    "SELECT DATE_FORMAT(el.timestamp, '%M %Y') AS month, COUNT(DISTINCT CASE WHEN el.action = 'User login' THEN el.logID END) AS login_count, COUNT(DISTINCT CASE WHEN o.orderNumber IS NOT NULL THEN o.orderNumber END) AS order_count FROM entry_log el LEFT JOIN orders o ON DATE_FORMAT(o.dateOfOrder, '%Y-%m') = DATE_FORMAT(el.timestamp, '%Y-%m') GROUP BY month ORDER BY DATE_FORMAT(el.timestamp, '%Y-%m')";

  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "An error occurred." });
    }

    const usersQ = "SELECT COUNT(*) AS userCount FROM usertable";
    db.query(usersQ, (err, usersCount) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "An error occurred." });
      }

      const sellersQ =
        "SELECT COUNT(*) AS sellerCount FROM usertable WHERE role = 'seller'";
      db.query(sellersQ, (err, sellersCount) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "An error occurred." });
        }

        const values = {
          data: data,
          users: usersCount[0].userCount,
          sellers: sellersCount[0].sellerCount,
        };
        return res.send(values);
      });
    });
  });
}

module.exports = usersEnterys;
