// server/index.js
//Ezri bashari
require("dotenv").config();
const express = require("express");
const router = require("../routes/routes");
const path = require("path"); // Import the path module
const cors = require("cors"); // Import the cors middleware
const bodyParser = require("body-parser"); // Import body-parser
const PORT = process.env.PORT || 8080;
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: ["Content-Type, Authorization"],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../client/src")));
app.use("/api", router);
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
