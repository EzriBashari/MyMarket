// config.js
const mysql = require("mysql");

const config = {
  host: "localhost",
  user: "root",
  // password: "Ezri1580!!!",
  database: "mymarket",
};
const db = mysql.createConnection(config);


module.exports = db;
