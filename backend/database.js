// database.js
import mysql from "mysql";
import config from "./config.js";

const db = mysql.createConnection(config);

export default db;
