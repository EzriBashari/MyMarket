const db = require("../../dbConnection");
async function fetchAllCategories(req, res) {
  const q = "SELECT * FROM category";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
}

module.exports = fetchAllCategories;
