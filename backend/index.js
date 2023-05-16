import  express  from "express";
import mysql from "mysql";

const app = express()

const db = mysql.createConnection({
  host: "localhost",
  user: "ezriB",
  password: "Ezri1580!!!",
  database: "mymarket",
});

app.get("/", (req, res) => {
  res.json("this is back end");
});

app.get("/item", (req, res) => {
  const q = "select *  from usertable";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(3000, ()=>{
  console.log("hello from backend");
})