// config.js
const mysql = require("mysql");

const config = {
  host: "localhost",
  user: "root",
  port: "3307",
  // password: "Ezri1580!!!",
  database: "mymarket",
};
const db = mysql.createConnection(config);

module.exports = db;
