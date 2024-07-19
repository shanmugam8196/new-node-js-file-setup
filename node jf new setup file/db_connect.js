const mysql = require("mysql");
const dotenv=require('dotenv')
dotenv.config();

const db = mysql.createConnection({
  host: process.env.HOST_NAME,
  port: process.env.PORT,
  user: process.env.user,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database!");
});

module.exports = db;