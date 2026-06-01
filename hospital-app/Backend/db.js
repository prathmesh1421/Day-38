const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", // your MySQL password
  database: "hospital",
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database Connection Failed:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

module.exports = db;
