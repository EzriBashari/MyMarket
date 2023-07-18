//#region imports
import express from "express";
import db from "./database.js"; // Update the path to database.js
import bcrypt from "bcrypt";
import validator from "email-validator";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import fs from "fs";
import cors from "cors";
import multer from "multer";
import { log } from "console";
//#endregion

const router = express.Router();

const saltRounds = 10;
var regexPassword = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
var regexImage = /\.(gif|jpg|jpeg|tiff|png)$/i;

router.use(cookieParser());
//#region register and login
router.post("/register", (req, res) => {
  if (
    req.body.email === "" ||
    req.body.password === "" ||
    req.body.firstName === "" ||
    req.body.lastName === "" ||
    req.body.address === "" ||
    req.body.image === "" ||
    req.body.phoneNumber === ""
  ) {
    res.send({ error: true, code: "400", message: "Missing Inputs" });
    return;
  }
  if (!validator.validate(req.body.email)) {
    res.send({ error: true, code: "401", message: "email is not valid" });
    return;
  }
  if (!regexPassword.test(req.body.password.toString())) {
    res.send({
      error: true,
      code: "402",
      message: "password is not in the right format",
    });
    return;
  }
  if (!regexImage.test(req.body.image.split("\\").pop())) {
    res.send({
      error: true,
      code: "402",
      message: "image is not in the right format",
    });
    return;
  }
  const checkEmailExists =
    "SELECT COUNT(*) AS email_count FROM usertable WHERE email = ?";

  // const image = req.body.image;

  const imageFilePath =
    "C:/Users/ezbis/Downloads/" + req.body.image.split("\\").pop();
  const imageBinaryData = fs.readFileSync(imageFilePath);

  const uploadDirectory = "../client/public/images/";
  const imageFileName = req.body.image.split("\\").pop();
  const destinationPath = uploadDirectory + imageFileName;

  fs.writeFileSync(destinationPath, imageBinaryData);
  //fs.existsSync(`../client/public/images${image}`)
  db.query(checkEmailExists, req.body.email, (err, data) => {
    if (err) return res.json(err);

    if (data[0].email_count === 0) {
      const q =
        "INSERT INTO `usertable`(`ID`, `email`, `password`, `FirstName`, `lastName`, `address`, `role`, `isAdmin`, `phoneNumber`, `status`, `image`) VALUES (?)";

      const password = req.body.password.toString();
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          // Store hash in your password DB.
          if (err) return res.json({ Error: "error for hashing" });
          const values = [
            req.body.ID,
            req.body.email,
            hash,
            req.body.firstName,
            req.body.lastName,
            req.body.address,
            req.body.role,
            req.body.isAdmin,
            req.body.phoneNumber,
            req.body.status,
            req.body.image,
          ];

          db.query(q, [values], (err, data) => {
            if (err) return res.json(err);
            return res.json(data);
          });
        });
      });
    } else {
      res.send({
        error: true,
        code: "402",
        message: "this email is in use",
      });

      //console.log(data[0].email_count);
      return;
    }
  });
});
router.post("/login", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    return res.json({ Error: "Missing Inputs" });
  }
  const q = "SELECT * FROM usertable WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Login Error from server" });
    if (data.length > 0) {
      bcrypt.compare(req.body.password, data[0].password, (err, response) => {
        if (err) return res.json({ Error: "password compare error" });
        if (response) {
          const userID = data[0].ID;
          console.log(data);
          const token = jwt.sign({ userID }, "jwt-secret-key", {
            expiresIn: "1d",
          });
          res.cookie("userID", userID);
          res.cookie("isAdmin", data[0].isAdmin);
          res.cookie("role", data[0].role);
          //console.log(req.cookies);
          return res.json({ Status: "Success" });
        } else {
          return res.json({ Error: "password is not correct" });
        }
      });
    } else {
      return res.json({ Error: "this email not exsists" });
    }
  });
});

router.get("/", (req, res) => {
  const q = "SELECT * FROM product WHERE `status` = 0";
  db.query(q, (err, data) => {
    if (err) {
      console.log("123456");
      return res.json(err);
    }
    return res.json(data);
  });
});

//#endregion

router.post("/products", (req, res) => {
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

  const imageFilePath =
    "C:/Users/ezbis/Downloads/" + req.body.image.split("\\").pop();
  const imageBinaryData = fs.readFileSync(imageFilePath);

  const uploadDirectory = "../client/public/images/";
  const imageFileName = req.body.image.split("\\").pop();
  const destinationPath = uploadDirectory + imageFileName;
  console.log(destinationPath);
  fs.writeFileSync(destinationPath, imageBinaryData);

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.post("/addCategory", (req, res) => {
  const q = "INSERT INTO `category`(`CategoryID`, `Name`) VALUES (?)";
  const values = [req.body.CategoryID, req.body.name];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.get("/categories", (req, res) => {
  const q = "SELECT * FROM category";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

router.post("/addToCart/:productNumber/:cartID", (req, res) => {
  const q =
    "INSERT INTO addproduct (productNumber, cartId, amount) VALUES (?, ?, ?)";
  console.log(req.params);
  const values = [req.params.productNumber, req.params.cartID, 1];
  db.query(q, values, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(200).json({ message: "Data successfully inserted" });
  });
});

router.delete("/cart/:productNumber", (req, res) => {
  const productId = req.params.productNumber;
  const q = "DELETE FROM addproduct WHERE productNumber = ?";

  db.query(q, [productId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product deleted successfully");
  });
});

router.put("/products/:productNumber", (req, res) => {
  const productId = req.params.productNumber;
  const q =
    "UPDATE `product` SET `productNumber`=?,`price`=?,`name`=?,`amount`=?,`CategoryID`=?,`ID`=?,`image`=?, `description`=?, `status`=? WHERE productNumber = ?";
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
  const imageFilePath =
    "C:/Users/ezbis/Downloads/" + req.body.image.split("\\").pop();
  const imageBinaryData = fs.readFileSync(imageFilePath);

  const uploadDirectory = "../client/public/images/";
  const imageFileName = req.body.image.split("\\").pop();
  const destinationPath = uploadDirectory + imageFileName;
  console.log(destinationPath);
  fs.writeFileSync(destinationPath, imageBinaryData);
  db.query(q, [...values, productId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product updated successfully");
  });
});

router.put("/products/disable/:productNumber", (req, res) => {
  const productId = req.params.productNumber;
  const q = "UPDATE `product` SET `status` = 1 WHERE productNumber = ?";

  db.query(q, [productId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Product disabled successfully");
  });
});

router.get("/cart", (req, res) => {
  const q =
    "SELECT product.* FROM addproduct JOIN product ON addproduct.productNumber = product.productNumber WHERE addproduct.cartId = ?";
  db.query(q, [1111], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
router.get("/profile/:userID", (req, res) => {
  //console.log(req.params);
  const userID = req.params.userID.split(":")[1];
  const q = "SELECT * FROM `usertable` WHERE ID = ?";
  db.query(q, [userID], (err, data) => {
    if (err) return res.json(err);
    console.log(userID);
    console.log(data);
    return res.json(data);
  });
});

export default router;
