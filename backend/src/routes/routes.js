const express = require("express");
// const cookieParser = require("cookie-parser");

/*** admin *****/
const sellersRevenue = require("../database/queries/admin/sellersRevenue");
const usersEnterys = require("../database/queries/admin/usersEnterys");
const setTax = require("../database/queries/admin/setTax");
const importTax = require("../database/queries/admin/importTax");
const sendMail = require("../database/queries/admin/sendMail");
const fetchSellersEmail = require("../database/queries/admin/fetchSellersEmail");
/*** usersTable *****/
const login = require("../database/queries/users/login");
const register = require("../database/queries/users/register");
const getPassword = require("../database/queries/users/restorePassword");
const changPassword = require("../database/queries/users/changePassword");
const updateProfile = require("../database/queries/users/updateProfile");
const getUserProfile = require("../database/queries/users/getUserProfile");
/*** products *****/
const addProduct = require("../database/queries/products/addProduct");
const updateProduct = require("../database/queries/products/updateProducte");
const deleteProduct = require("../database/queries/products/deleteProduct");
const fetchAllProducts = require("../database/queries/products/fetchAllProduct");
const fetchStorProduct = require("../database/queries/products/fetchStorProduct");
/*** cart ****/
const addProductToCart = require("../database/queries/cart/addProductToCart");
const removeFromCart = require("../database/queries/cart/removeFromCart");
const displayCart = require("../database/queries/cart/displayCart");
const increment = require("../database/queries/cart/increment");
const decrement = require("../database/queries/cart/decrement");
const checkProduct = require("../database/queries/cart/checkProduct");

/*** orders *****/
const placeOrder = require("../database/queries/orders/placeOrder")
const fetchBuyerOrders = require("../database/queries/orders/fetchBuyerOrders");
const fetchProductsInOrder = require("../database/queries/orders/fetchProductsInOrder");
/*** category *****/
const { addCategory } = require("../database/queries/category/addCategory");
const { deleteCategory } = require("../database/queries/category/addCategory");
const fetchAllCategories = require("../database/queries/category/fetchAllCategories");
/*** seller *****/
const fetchSellerProducts = require("../database/queries/seller/fetchSellerProducts");
const fetchSellerSales = require("../database/queries/seller/fetchSellerSales");
const orderSent = require("../database/queries/seller/orderSent");
const confirmOrder = require("../database/queries/seller/confirmOrder");
const orderCompleted = require("../database/queries/seller/orderCompleted");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

/***** admin ******/
router.post("/sellersRevenue", sellersRevenue);
router.post("/usersEnterys", usersEnterys);
router.post("/setTax", setTax);
router.post("/importTax", importTax);
router.post("/sendMail", sendMail);
router.post("/fetchSellersEmail", fetchSellersEmail);
/***** user ******/
router.post("/login", login);
router.post("/register", upload.single("file"), register);
router.get("/profile/:userID", getUserProfile);
router.post("/sendRandomPassword", getPassword);
router.post("/changePassword", changPassword);
router.post("/updateProfile", upload.single("file"), updateProfile);
/***** seller *******/
router.get("/fetchSellerProducts:sellerId", fetchSellerProducts);
router.get("/fetchMySales:sellerId", fetchSellerSales);
router.post("/orderSent", orderSent);
router.post("/confirmOrder", confirmOrder);
router.post("/orderCompleted", orderCompleted);

/***** products *******/
router.post("/addProduct", upload.single("file"), addProduct);
router.post("/updateProduct", upload.single("file"), updateProduct);
router.put("/products/disable/:productNumber", deleteProduct);
router.post("/fetchAllProduct", fetchAllProducts);
router.get("/fetchStorProduct/:productId", fetchStorProduct);
/*** cart *****/
router.post("/addToCart", addProductToCart);
router.delete("/removeFromCart", removeFromCart);
router.get("/displayCart/:userID", displayCart);
router.post("/increment", increment);
router.post("/decrement", decrement);
router.post("/checked", checkProduct);
/*** order *****/
router.post("/placeOrder", placeOrder);
router.get("/myOrders/:userID", fetchBuyerOrders);
router.post("/fetchProductsInOrder", fetchProductsInOrder);
/*** category *****/
router.post("/addCategory", addCategory);
router.delete("/deleteCategory/:id", deleteCategory);
router.get("/fetchAllCategories", fetchAllCategories);

module.exports = router;
