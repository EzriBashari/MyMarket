const db = require("../../dbConnection");
// const express = require("express");
// const app = express();
// const paypal = require("../payment/paypal");
// console.log("out of place order");
async function placeOrder(req, res) {
  // console.log("in place order");

  const { userID, checkedItems } = req.body;
  // app.post("/pay", async (req, res) => {
  //   console.log("in pay");

  //   try {
  //     const url = await paypal.createOrder();

  //     res.redirect(url);
  //   } catch (error) {
  //     res.send("Error: " + error);
  //   }
  // });

  // app.get("/complete-order", async (req, res) => {
  //   console.log("in complete order");

  //   try {
  //     await paypal.capturePayment(req.query.token);

  //     res.send("Course purchased successfully");
  //   } catch (error) {
  //     res.send("Error: " + error);
  //   }
  // });

  // app.get("/cancel-order", (req, res) => {
  //   console.log("in cancel order");

  //   res.redirect("/");
  // });

  try {
    // Calculate the total price based on the checked items
    // console.log("in my place order");

    const totalPrice = checkedItems.reduce(
      (accumulator, item) => accumulator + item.cartAmount * item.price,
      0
    );

    // Start a database transaction
    await db.beginTransaction();

    // Insert a new order record into the orders table
    const insertOrderQuery =
      "INSERT INTO `orders` (`price`, `dateOfOrder`, `buyerID`) VALUES (?, NOW(), ?)";
    const orderValues = [totalPrice, userID];

    db.query(insertOrderQuery, orderValues, async (err, orderData) => {
      if (err) {
        console.log(err);
        await db.rollback();
        return res.json(err);
      }

      const orderNumber = orderData.insertId;

      const insertIncludesQuery =
        "INSERT INTO includes (orderNumber, productNumber, amount, sellerId) VALUES ?";
      const includesValues = checkedItems.map((item) => [
        orderNumber,
        item.productNumber,
        item.cartAmount,
        item.ID,
      ]);

      db.query(insertIncludesQuery, [includesValues], async (err) => {
        if (err) {
          console.log(err);
          await db.rollback();
          return res.json(err);
        }

        const updateProductAmountQuery =
          "UPDATE product SET amount = amount - ? WHERE productNumber = ?";
        const updateProductPromises = checkedItems.map((item) => {
          return new Promise((resolve, reject) => {
            db.query(
              updateProductAmountQuery,
              [item.cartAmount, item.productNumber],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        });

        try {
          await Promise.all(updateProductPromises);
        } catch (error) {
          console.log(error);
          await db.rollback();
          return res.status(500).json({
            success: false,
            message: "An error occurred while updating product amounts.",
          });
        }

        const removeAfterOrder = checkedItems.map((item) => [
          item.productNumber,
        ]);
        const deleteQuery = "DELETE FROM addproduct WHERE productNumber IN (?)";

        db.query(deleteQuery, [removeAfterOrder], async (err, deleteData) => {
          if (err) {
            console.log(err);
            await db.rollback();
            return res.json(err);
          }

          await db.commit();
          const logQ =
            "INSERT INTO entry_log (userID, action, details) VALUES (?)";
          const logValuesQ = [userID, "Placed Order", "User placed an order"];
          db.query(logQ, [logValuesQ], (err) => {
            if (err) {
              console.log(err);
            }
          });
          // Send a success response back to the client
          res.json({
            success: true,
            orderNumber: orderNumber,
            message: "Order placed successfully.",
          });
        });
      });
    });
  } catch (error) {
    // If an error occurs, rollback the transaction and send an error response
    console.log("Error", error);
    await db.rollback();
    res.status(500).json({
      success: false,
      message: "An error occurred while placing the order.",
    });
  }
}

module.exports = placeOrder;
