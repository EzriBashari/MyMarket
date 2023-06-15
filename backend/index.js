import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "ezriB",
  password: "Ezri1580!!!",
  database: "mymarket",
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const q = "SELECT * FROM product where `status` = 0";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/products", (req, res) => {
  const q =
    "INSERT INTO `product`(`productNumber`, `price`, `name`, `amount`, `CategoryID`, `ID`, `image`, `description`, `status`) VALUES (?)";
  const values = [
    req.body.productNumber,
    req.body.price,
    req.body.name,
    req.body.amount,
    req.body.CategoryID,
    req.body.SellerID,
    req.body.image,
    req.body.description,
    0,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.post("/addCategory", (req, res) => {
  const q = "INSERT INTO `category`(`CategoryID`, `Name`) VALUES (?)";
  const values = [req.body.CategoryID, req.body.name];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.get("/categories", (req, res) => {
  const q = "SELECT * FROM category";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
app.post("/addToCart/:productNumber/:cartID", (req, res) => {
  const q =
    "INSERT INTO `addproduct`(`productNumber`, `cartId`, `amount`) VALUES (?)";
  const values = [req.params.productNumber, req.params.cartID, 1];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.delete("/cart/:productNumber", (req, res) => {
  const productId = req.params.productNumber;
  const q = "DELETE FROM addproduct WHERE productNumber = ?";

  db.query(q, [productId], (err, data) => {
    if (err) return res.json(err);
    return res.json("product deleted *****");
  });
});

app.put("/products/:productNumber", (req, res) => {
  const productId = req.params.productNumber;
  const q =
    "UPDATE `product` SET `productNumber`=?,`price`=?,`name`=?,`amount`=?,`CategoryID`=?,`ID`=?,`image`=?, `description`=? `status`=? WHERE productNumber = ?";
  const values = [
    req.body.productNumber,
    req.body.price,
    req.body.name,
    req.body.amount,
    req.body.CategoryID,
    req.body.SellerID,
    req.body.image,
    0,
  ];
  db.query(q, [...values, productId], (err, data) => {
    if (err) return res.json(err);
    return res.json("product Update *****");
  });
});

app.put("/products/disable/:productNumber", (req, res) => {
  const productId = req.params.productNumber;
  const q = "UPDATE `product` SET `status` = 1 WHERE productNumber = ? ";

  db.query(q, [productId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product disabled successfully");
  });
});

app.get("/cart", (req, res) => {
  const q =
    "SELECT product.* FROM addproduct JOIN product ON addproduct.productNumber = product.productNumber WHERE addproduct.cartId = ? ";
  db.query(q, [1], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(8080, () => {
  console.log("hello from backend");
});
