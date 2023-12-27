const db = require("../../dbConnection");

async function addProductToCart(req, res) {
  const q =
    "SELECT ap.*, p.amount AS productAmount FROM addproduct AS ap JOIN product AS p ON ap.productNumber = p.productNumber WHERE ap.productNumber = ? AND ap.cartId = (SELECT cartId FROM cart WHERE userID = ?)";

  const values = [req.body.productNumber, req.body.userID];
  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }

    if (data.length > 0) {
  
      const updateAmountQuery =
        "UPDATE `addproduct` SET `amount`= ? WHERE productNumber = ? AND cartId = ?";
      const insertValues = [
        data[0].productAmount > req.body.amount + data[0].amount
          ? req.body.amount + data[0].amount
          : data[0].productAmount,
        data[0].productNumber,
        data[0].cartId,
      ];

      db.query(updateAmountQuery, insertValues, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Server error" });
        }

        return res.status(200).json({ message: "Data successfully inserted" });
      });
    } else {
      // If the data array is empty, the combination does not exist, so insert the new entry
      const getCartId = "SELECT * FROM `cart` WHERE `userID` = ?";
      db.query(getCartId, req.body.userID, (err, cartID) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Server error" });
        }
        const insertQuery =
          "INSERT INTO addproduct (productNumber, cartId, amount) VALUES (?, ?, ?)";
        const insertValues = [
          req.body.productNumber,
          cartID[0].cartId,
          req.body.amount,
        ];

        db.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Server error" });
          }

          return res
            .status(200)
            .json({ message: "Data successfully inserted" });
        });
      });
    }
  });
}

module.exports = addProductToCart;
